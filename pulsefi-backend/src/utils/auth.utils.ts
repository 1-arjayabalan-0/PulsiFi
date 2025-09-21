import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import zxcvbn from 'zxcvbn';
import { prisma } from '../index';

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  const result = zxcvbn(password);
  
  // Password must be at least 8 characters
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Password must have a score of at least 3 (0-4 scale)
  if (result.score < 3) {
    return { 
      isValid: false, 
      message: 'Password is too weak. Please include a mix of uppercase, lowercase, numbers, and special characters.'
    };
  }
  
  return { isValid: true, message: 'Password is strong enough' };
};

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a password with a hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate an access JWT token
 */
export const generateAccessToken = (userId: string): string => {
  const secret = process.env.JWT_ACCESS_SECRET || 'access-secret';
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn } as jwt.SignOptions
  );
};

/**
 * Generate a refresh token
 */
export const generateRefreshToken = async (userId: string): Promise<string> => {
  // Generate a random token
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  
  const token = jwt.sign(
    { id: userId },
    secret,
    { expiresIn: refreshExpiresIn } as jwt.SignOptions
  );
  
  // Calculate expiry date
  const expiresAt = new Date();
  if (refreshExpiresIn.endsWith('d')) {
    expiresAt.setDate(expiresAt.getDate() + parseInt(refreshExpiresIn));
  } else if (refreshExpiresIn.endsWith('h')) {
    expiresAt.setHours(expiresAt.getHours() + parseInt(refreshExpiresIn));
  } else if (refreshExpiresIn.endsWith('m')) {
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(refreshExpiresIn));
  }
  
  // Store in database
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt
    }
  });
  
  return token;
};

/**
 * Verify a refresh token
 */
export const verifyRefreshToken = async (token: string): Promise<{ userId: string } | null> => {
  try {
    // Find token in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token }
    });
    
    if (!storedToken) {
      return null;
    }
    
    // Check if token is expired
    if (new Date() > storedToken.expiresAt) {
      // Delete expired token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });
      return null;
    }
    
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    
    return { userId: decoded.id };
  } catch (error) {
    return null;
  }
};

/**
 * Delete all refresh tokens for a user
 */
export const deleteAllRefreshTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { userId }
  });
};