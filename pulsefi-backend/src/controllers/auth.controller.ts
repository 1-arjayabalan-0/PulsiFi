import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserById } from '../services/auth.service';
import { createSuccessResponse, HttpStatus, ErrorCode, sendSuccessResponse } from '../utils/response.utils';
import { 
  generateTokens,
  refreshTokens,
  deleteRefreshToken, 
  deleteAllRefreshTokens 
} from '../services/token.service';
import { AppError } from '../utils/app-error.utils';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    
    // Split name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Register user through service layer
    const result = await registerUser(email, password, firstName, lastName);
    
    // Generate tokens
    const { accessToken, refreshToken, expiresIn } = await generateTokens({
      id: result.user.id,
      email: result.user.email
    });
    
    // Return success response with user data
    return sendSuccessResponse(res, {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: `${result.profile.firstName} ${result.profile.lastName}`.trim(),
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn
      }
    }, 'User registered successfully', HttpStatus.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Login user through service layer
    const user = await loginUser(email, password);
    
    // Generate tokens
    const { accessToken, refreshToken, expiresIn } = await generateTokens({
      id: user.id,
      email: user.email
    });
    
    // Return success response with user data
    return sendSuccessResponse(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.firstName && user.profile?.lastName 
          ? `${user.profile.firstName} ${user.profile.lastName}`.trim()
          : user.email.split('@')[0]
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn
      }
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;
    
    if (!token) {
      throw AppError.badRequest('Refresh token is required', { code: ErrorCode.INVALID_INPUT });
    }
    
    // Refresh tokens through service layer
    const tokens = await refreshTokens(token);
    
    // Return success response with new tokens
    return sendSuccessResponse(res, tokens, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user (invalidate refresh token)
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw AppError.badRequest('Refresh token is required', { code: ErrorCode.INVALID_INPUT });
    }
    
    // Delete refresh token
    await deleteRefreshToken(refreshToken);
    
    // Return success response
    return sendSuccessResponse(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Logout from all devices (invalidate all refresh tokens)
 */
export const logoutAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user from request (set by auth middleware)
    const userId = req.user?.id;
    
    if (!userId) {
      throw AppError.unauthorized('Authentication required');
    }
    
    // Delete all refresh tokens for user
    await deleteAllRefreshTokens(userId);
    
    // Return success response
    return sendSuccessResponse(res, null, 'Logged out from all devices successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user from request (set by auth middleware)
    const userId = req.user?.id;
    
    if (!userId) {
      throw AppError.unauthorized('Authentication required');
    }
    
    // Get user from service
    const user = await getUserById(userId);
    
    // Return success response with user data
    return sendSuccessResponse(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.firstName && user.profile?.lastName 
          ? `${user.profile.firstName} ${user.profile.lastName}`.trim()
          : user.email.split('@')[0]
      }
    }, 'User profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};