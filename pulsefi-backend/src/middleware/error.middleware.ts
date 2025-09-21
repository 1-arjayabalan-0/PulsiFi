import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { AppError } from '../utils/app-error.utils';
import { ErrorCode, HttpStatus } from '../utils/response.utils';
import { createErrorResponse } from '../utils/response.utils';
import { getErrorCodeForStatus } from '../utils/error-messages.utils';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging with full stack trace
  console.error('Error:', err);
  console.error('Stack:', err.stack);

  // Add request path to error response metadata
  const path = req.path;
  const method = req.method;

  // Handle AppError instances
  if (err instanceof AppError) {
    const response = createErrorResponse(
      err.errorCode,
      err.message,
      err.details
    );
    
    // Add path to metadata
    response.meta = {
      ...response.meta,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
    
    return res.status(err.statusCode).json(response);
  }

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    let errorCode = ErrorCode.DATABASE_ERROR;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database operation failed';
    
    // Handle specific Prisma error codes
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        errorCode = ErrorCode.RESOURCE_ALREADY_EXISTS;
        statusCode = HttpStatus.CONFLICT;
        message = 'A record with this data already exists';
        break;
      case 'P2025': // Record not found
        errorCode = ErrorCode.RESOURCE_NOT_FOUND;
        statusCode = HttpStatus.NOT_FOUND;
        message = 'The requested record was not found';
        break;
      case 'P2003': // Foreign key constraint failed
        errorCode = ErrorCode.INVALID_INPUT;
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Invalid reference to a related record';
        break;
    }
    
    const response = createErrorResponse(errorCode, message, {
      code: err.code,
      meta: err.meta,
    });
    
    // Add path to metadata
    response.meta = {
      ...response.meta,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
    
    return res.status(statusCode).json(response);
  }

  if (err instanceof PrismaClientValidationError) {
    const response = createErrorResponse(
      ErrorCode.VALIDATION_ERROR,
      'Invalid data provided for database operation',
      { message: err.message }
    );
    
    // Add path to metadata
    response.meta = {
      ...response.meta,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
    
    return res.status(HttpStatus.BAD_REQUEST).json(response);
  }

  // Handle validation errors (e.g., from express-validator)
  if (err.name === 'ValidationError' || err.name === 'SyntaxError') {
    const response = createErrorResponse(
      ErrorCode.VALIDATION_ERROR,
      err.message || 'Validation error',
      { name: err.name }
    );
    
    // Add path to metadata
    response.meta = {
      ...response.meta,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
    
    return res.status(HttpStatus.BAD_REQUEST).json(response);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    const errorCode = err.name === 'TokenExpiredError' 
      ? ErrorCode.TOKEN_EXPIRED 
      : ErrorCode.INVALID_TOKEN;
    
    const response = createErrorResponse(
      errorCode,
      err.message || 'Authentication error',
      { name: err.name }
    );
    
    // Add path to metadata
    response.meta = {
      ...response.meta,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
    
    return res.status(HttpStatus.UNAUTHORIZED).json(response);
  }

  // Handle all other errors as internal server errors
  const response = createErrorResponse(
    ErrorCode.INTERNAL_ERROR,
    process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message || 'Internal server error',
    process.env.NODE_ENV === 'production' ? undefined : {
      name: err.name,
      stack: err.stack,
    }
  );
  
  // Add path to metadata
  response.meta = {
    ...response.meta,
    timestamp: new Date().toISOString(),
    path,
    method,
  };
  
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
};

/**
 * Middleware to handle 404 errors for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response) => {
  const response = createErrorResponse(
    ErrorCode.RESOURCE_NOT_FOUND,
    `Cannot ${req.method} ${req.path}`,
    { method: req.method, path: req.path }
  );
  
  // Add path to metadata
  response.meta = {
    ...response.meta,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };
  
  res.status(HttpStatus.NOT_FOUND).json(response);
};