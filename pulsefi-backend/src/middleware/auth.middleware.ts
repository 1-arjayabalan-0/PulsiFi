import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { AppError } from '../utils/app-error.utils';
import { ErrorCode } from '../utils/response.utils';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

/**
 * Authentication middleware to protect routes
 * Verifies the JWT access token and attaches the user to the request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    if (!token) {
      throw AppError.unauthorized('Authentication required');
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access-secret') as {
        id: string;
        email: string;
        iat: number;
        exp: number;
      };
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          isVerified: true,
          profile: true
        }
      });

      if (!user) {
        throw AppError.unauthorized('User not found');
      }

      // Add user to request
      req.user = user;
      next();
    } catch (jwtError: any) {
      // Handle specific JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        throw AppError.unauthorized('Token expired');
      } else {
          throw AppError.unauthorized('Invalid token');
        }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param roles Array of allowed roles
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('Authentication required');
      }

      const userRole = req.user.role || 'user';
      
      if (!roles.includes(userRole)) {
        throw AppError.forbidden('Insufficient permissions');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};