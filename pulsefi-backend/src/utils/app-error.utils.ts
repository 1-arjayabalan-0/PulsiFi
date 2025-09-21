import { ErrorCode, HttpStatus } from './response.utils';
import { getErrorMessage } from './error-messages.utils';

/**
 * Custom application error class
 */
export class AppError extends Error {
  public readonly errorCode: ErrorCode;
  public readonly statusCode: HttpStatus;
  public readonly details?: any;
  public readonly isOperational: boolean;

  /**
   * Creates a new AppError instance
   * @param errorCode The error code
   * @param message Optional custom error message
   * @param statusCode HTTP status code
   * @param details Additional error details
   * @param isOperational Whether this is an operational error
   */
  constructor(
    errorCode: ErrorCode,
    message?: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: any,
    isOperational: boolean = true
  ) {
    // Use provided message or get default message for the error code
    const errorMessage = message || getErrorMessage(errorCode);
    super(errorMessage);

    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Creates an error for invalid input
   * @param message Custom error message
   * @param details Validation details
   * @returns AppError instance
   */
  static badRequest(message?: string, details?: any): AppError {
    return new AppError(
      ErrorCode.INVALID_INPUT,
      message,
      HttpStatus.BAD_REQUEST,
      details
    );
  }

  /**
   * Creates an error for unauthorized access
   * @param message Custom error message
   * @returns AppError instance
   */
  static unauthorized(message?: string): AppError {
    return new AppError(
      ErrorCode.INVALID_CREDENTIALS,
      message,
      HttpStatus.UNAUTHORIZED
    );
  }

  /**
   * Creates an error for forbidden access
   * @param message Custom error message
   * @returns AppError instance
   */
  static forbidden(message?: string): AppError {
    return new AppError(
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      message,
      HttpStatus.FORBIDDEN
    );
  }

  /**
   * Creates an error for resource not found
   * @param message Custom error message
   * @returns AppError instance
   */
  static notFound(message?: string): AppError {
    return new AppError(
      ErrorCode.RESOURCE_NOT_FOUND,
      message,
      HttpStatus.NOT_FOUND
    );
  }

  /**
   * Creates an error for resource conflict
   * @param message Custom error message
   * @returns AppError instance
   */
  static conflict(message?: string): AppError {
    return new AppError(
      ErrorCode.RESOURCE_CONFLICT,
      message,
      HttpStatus.CONFLICT
    );
  }

  /**
   * Creates an error for validation failure
   * @param message Custom error message
   * @param details Validation details
   * @returns AppError instance
   */
  static validationError(message?: string, details?: any): AppError {
    return new AppError(
      ErrorCode.VALIDATION_ERROR,
      message,
      HttpStatus.UNPROCESSABLE_ENTITY,
      details
    );
  }

  /**
   * Creates an error for internal server error
   * @param message Custom error message
   * @param details Error details
   * @returns AppError instance
   */
  static internal(message?: string, details?: any): AppError {
    return new AppError(
      ErrorCode.INTERNAL_ERROR,
      message || 'An internal server error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
      false // Not operational as it's a server error
    );
  }
}