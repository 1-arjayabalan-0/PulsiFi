import { prisma } from '../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { withErrorHandling, ensureExists, ensure } from '../utils/service.utils';
import { AppError } from '../utils/app-error.utils';
import { ErrorCode } from '../utils/response.utils';
import { User } from '@prisma/client';

/**
 * Register a new user
 */
export const registerUser = withErrorHandling(
  async (email: string, password: string, firstName: string, lastName: string) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw AppError.badRequest('Account with this email already exists. Please login instead.', { code: ErrorCode.USER_ALREADY_EXISTS });
    }

    // Validate password
    if (password.length < 8) {
      throw AppError.badRequest('Password must be at least 8 characters long', { code: ErrorCode.WEAK_PASSWORD });
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      throw AppError.badRequest('Password must contain at least one number', { code: ErrorCode.WEAK_PASSWORD });
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      throw AppError.badRequest('Password must contain at least one uppercase letter', { code: ErrorCode.WEAK_PASSWORD });
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw AppError.badRequest('Password must contain at least one special character', { code: ErrorCode.WEAK_PASSWORD });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user and profile in a transaction
    return await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          isVerified: true, // Set to true for testing
        },
      });

      // Create profile
      const profile = await prisma.profile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
        },
      });

      return { user, profile };
    });
  }
);

/**
 * Login a user
 */
export const loginUser = withErrorHandling(
  async (email: string, password: string) => {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    // Check if user exists
    if (!user) {
      throw AppError.badRequest('Account not found. Please check your email or register.', { code: ErrorCode.USER_NOT_FOUND });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw AppError.badRequest('Incorrect password. Please try again.', { code: ErrorCode.INVALID_CREDENTIALS });
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw AppError.forbidden('Email not verified. Please verify your email before logging in.');
    }

    return user;
  }
);

/**
 * Generate access token
 */
export const generateAccessToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_SECRET || 'access-secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' } as jwt.SignOptions
  );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = withErrorHandling(
  async (userId: string): Promise<string> => {
    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        ),
      },
    });

    return refreshToken;
  }
);

/**
 * Verify refresh token
 */
export const verifyRefreshToken = withErrorHandling(
  async (refreshToken: string) => {
    // Find refresh token in database
    const tokenData = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    // Check if token exists and is not expired
    if (!tokenData || tokenData.expiresAt < new Date()) {
      throw AppError.unauthorized('Invalid or expired refresh token');
    }

    return tokenData;
  }
);

/**
 * Delete refresh token
 */
export const deleteRefreshToken = withErrorHandling(
  async (refreshToken: string) => {
    return await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }
);

/**
 * Delete all refresh tokens for a user
 */
export const deleteAllRefreshTokens = withErrorHandling(
  async (userId: string) => {
    return await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
);

/**
 * Get user by ID
 */
export const getUserById = withErrorHandling(
  async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    return ensureExists(user, 'User not found', ErrorCode.RESOURCE_NOT_FOUND);
  }
);