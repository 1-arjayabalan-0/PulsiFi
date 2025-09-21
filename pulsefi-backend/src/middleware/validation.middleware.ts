import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/app-error.utils';
import { ErrorCode } from '../utils/response.utils';

/**
 * Middleware to validate request using express-validator
 * Throws a standardized error if validation fails
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map(error => ({
      field: 'path' in error ? error.path : 'unknown',
      message: error.msg
    }));
    
    throw AppError.badRequest('Validation failed');
  }
  
  next();
};