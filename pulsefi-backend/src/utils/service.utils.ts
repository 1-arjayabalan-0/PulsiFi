import { AppError } from './app-error.utils';
import { ErrorCode } from './response.utils';

/**
 * Service layer utility functions for standardized error handling
 */

/**
 * Wraps a service function with standardized error handling
 * @param serviceFunction The service function to wrap
 * @returns The wrapped function with standardized error handling
 */
export const withErrorHandling = <T, Args extends any[]>(
  serviceFunction: (...args: Args) => Promise<T>
) => {
  return async (...args: Args): Promise<T> => {
    try {
      return await serviceFunction(...args);
    } catch (error) {
      // If it's already an AppError, just rethrow it
      if (error instanceof AppError) {
        throw error;
      }

      // Handle specific error types
      if (error instanceof Error) {
        // Handle Prisma errors
        if (error.name === 'PrismaClientKnownRequestError') {
          const prismaError = error as any;
          switch (prismaError.code) {
            case 'P2002': // Unique constraint violation
              throw AppError.badRequest('A record with this data already exists');
            case 'P2025': // Record not found
              throw AppError.notFound('The requested record was not found');
            case 'P2003': // Foreign key constraint failed
              throw AppError.badRequest('Invalid reference to a related record');
            default:
              throw AppError.internal('Database operation failed', { code: prismaError.code });
          }
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
          throw AppError.badRequest(error.message || 'Validation error');
        }

        // Handle JWT errors
        if (error.name === 'JsonWebTokenError') {
          throw AppError.unauthorized('Invalid token');
        }

        if (error.name === 'TokenExpiredError') {
          throw AppError.unauthorized('Token expired');
        }
      }

      // For any other error, wrap it as an internal error
      throw AppError.internal(
        'An unexpected error occurred',
        process.env.NODE_ENV === 'production' ? undefined : { originalError: error }
      );
    }
  };
};

/**
 * Ensures a resource exists or throws a not found error
 * @param resource The resource to check
 * @param message The error message
 * @param errorCode The error code
 */
export const ensureExists = <T>(
  resource: T | null | undefined,
  message = 'Resource not found',
  errorCode = ErrorCode.RESOURCE_NOT_FOUND
): T => {
  if (!resource) {
    throw AppError.notFound(message);
  }
  return resource;
};

/**
 * Ensures a condition is true or throws an error
 * @param condition The condition to check
 * @param errorFn The function to create an error if the condition is false
 */
export const ensure = <T>(
  condition: boolean,
  errorFn: () => AppError
): void => {
  if (!condition) {
    throw errorFn();
  }
};

/**
 * Ensures that a condition is met, otherwise throws a forbidden error
 * @param condition The condition to check
 * @param message The error message
 * @param errorCode The error code
 */
export const ensurePermission = (
  condition: boolean,
  message = 'You do not have permission to access this resource',
  errorCode = ErrorCode.INSUFFICIENT_PERMISSIONS
): void => {
  if (!condition) {
    throw AppError.forbidden(message);
  }
};