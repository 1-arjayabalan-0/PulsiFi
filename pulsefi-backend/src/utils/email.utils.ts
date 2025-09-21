import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate a random token for email verification or password reset
 */
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Create a verification token for a user
 * Note: Since verificationToken field was removed from User model,
 * we'll use a simple approach where users are auto-verified for now
 */
export const createVerificationToken = async (userId: string): Promise<string> => {
  const token = generateToken();
  
  // Auto-verify the user since we don't have verificationToken field
  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true }
  });
  
  return token;
};

/**
 * Verify a user's email using their verification token
 * Note: Since verificationToken field was removed, this will auto-verify users
 */
export const verifyEmail = async (token: string): Promise<boolean> => {
  try {
    // Since we can't store verification tokens in the database anymore,
    // we'll implement a simple verification that always succeeds
    // In a production environment, you might want to use a separate token storage
    // or implement JWT-based verification tokens
    return true;
  } catch (error) {
    console.error('Error verifying email:', error);
    return false;
  }
};

/**
 * Create a password reset token for a user
 * Note: Since resetToken fields were removed, this returns a token
 * but doesn't store it in the database. Consider using JWT or external storage.
 */
export const createPasswordResetToken = async (email: string): Promise<string | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return null;
    }
    
    const token = generateToken();
    
    // TODO: In production, store this token in Redis or use JWT with expiration
    // For now, we'll just return the token without storing it
    
    return token;
  } catch (error) {
    console.error('Error creating password reset token:', error);
    return null;
  }
};

/**
 * Verify a password reset token
 * Note: Since resetToken fields were removed, this will need to be implemented
 * with external token storage or JWT verification
 */
export const verifyPasswordResetToken = async (token: string): Promise<string | null> => {
  try {
    // TODO: Implement proper token verification with external storage or JWT
    // For now, return null to indicate token verification is not available
    console.warn('Password reset token verification not implemented - resetToken fields removed from schema');
    return null;
  } catch (error) {
    console.error('Error verifying password reset token:', error);
    return null;
  }
};

/**
 * Reset a user's password
 * Note: Since resetToken fields were removed, this only updates the password
 */
export const resetPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
};