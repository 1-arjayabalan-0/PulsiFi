import { ErrorCode } from './response.utils';

/**
 * Maps error codes to their default messages
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Authentication errors
  [ErrorCode.INVALID_CREDENTIALS]: 'The provided credentials are invalid',
  [ErrorCode.ACCOUNT_DISABLED]: 'This account has been disabled',
  [ErrorCode.EMAIL_NOT_VERIFIED]: 'Email address has not been verified',
  [ErrorCode.INVALID_TOKEN]: 'The provided token is invalid',
  [ErrorCode.TOKEN_EXPIRED]: 'The provided token has expired',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'You do not have permission to perform this action',
  
  // Validation errors
  [ErrorCode.VALIDATION_ERROR]: 'Validation failed for the provided data',
  [ErrorCode.INVALID_INPUT]: 'The provided input is invalid',
  [ErrorCode.MISSING_REQUIRED_FIELD]: 'A required field is missing',
  [ErrorCode.UNAUTHORIZED]: 'Authentication required',
  
  // Resource errors
  [ErrorCode.RESOURCE_NOT_FOUND]: 'The requested resource was not found',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: 'The resource already exists',
  [ErrorCode.RESOURCE_CONFLICT]: 'The operation would conflict with existing data',
  
  // Server errors
  [ErrorCode.INTERNAL_ERROR]: 'An internal server error occurred',
  [ErrorCode.DATABASE_ERROR]: 'A database error occurred',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'An error occurred with an external service',
  
  // Business logic errors
  [ErrorCode.BUSINESS_RULE_VIOLATION]: 'The operation violates a business rule',
  [ErrorCode.OPERATION_NOT_ALLOWED]: 'This operation is not allowed',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded, please try again later',
};

/**
 * Gets the error message for a given error code
 * @param code The error code
 * @param defaultMessage Optional default message if code is not found
 * @returns The error message
 */
export const getErrorMessage = (code: ErrorCode, defaultMessage?: string): string => {
  return ERROR_MESSAGES[code] || defaultMessage || 'An error occurred';
};

/**
 * Maps HTTP status codes to common error codes
 */
export const HTTP_STATUS_TO_ERROR_CODE: Record<number, ErrorCode> = {
  400: ErrorCode.INVALID_INPUT,
  401: ErrorCode.INVALID_CREDENTIALS,
  403: ErrorCode.INSUFFICIENT_PERMISSIONS,
  404: ErrorCode.RESOURCE_NOT_FOUND,
  409: ErrorCode.RESOURCE_CONFLICT,
  422: ErrorCode.VALIDATION_ERROR,
  429: ErrorCode.RATE_LIMIT_EXCEEDED,
  500: ErrorCode.INTERNAL_ERROR,
  503: ErrorCode.EXTERNAL_SERVICE_ERROR,
};

/**
 * Gets an appropriate error code for an HTTP status code
 * @param statusCode The HTTP status code
 * @param fallbackCode Optional fallback error code
 * @returns The error code
 */
export const getErrorCodeForStatus = (statusCode: number, fallbackCode: ErrorCode = ErrorCode.INTERNAL_ERROR): ErrorCode => {
  return HTTP_STATUS_TO_ERROR_CODE[statusCode] || fallbackCode;
};