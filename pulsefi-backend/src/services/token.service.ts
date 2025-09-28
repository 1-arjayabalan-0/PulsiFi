import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/app-error.utils';
import { ErrorCode } from '../utils/response.utils';

// Token types
export interface TokenPayload {
  id: string;
  email: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Constants
const ACCESS_TOKEN_EXPIRY = '1d'; // 1 day
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'access-secret', {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generate refresh token and store in database
 */
export const generateRefreshToken = async (userId: string): Promise<string> => {
  // Create a unique token
  const refreshToken = uuidv4();
  
  // Store in database with expiry
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
  
  return refreshToken;
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = async (user: TokenPayload): Promise<TokenResponse> => {
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60, // 15 minutes in seconds
  };
};

/**
 * Verify and refresh tokens
 */
export const refreshTokens = async (refreshToken: string): Promise<TokenResponse> => {
  // Find the refresh token in database
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });
  
  // Validate token
  if (!tokenRecord) {
    throw AppError.unauthorized('Invalid refresh token');
  }
  
  // Check if token is expired
  if (tokenRecord.expiresAt < new Date()) {
    // Delete expired token
    await prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    });
    throw AppError.unauthorized('Refresh token expired');
  }
  
  // Generate new tokens
  const user = {
    id: tokenRecord.user.id,
    email: tokenRecord.user.email,
  };
  
  // Delete old refresh token
  await prisma.refreshToken.delete({
    where: { id: tokenRecord.id },
  });
  
  // Generate new tokens
  return generateTokens(user);
};

/**
 * Delete refresh token
 */
export const deleteRefreshToken = async (token: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { token },
  });
};

/**
 * Delete all refresh tokens for a user
 */
export const deleteAllRefreshTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};