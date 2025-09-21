import { Response } from 'express';

/**
 * Standard HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Standard error codes for the application
 */
export enum ErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'AUTH_001',
  ACCOUNT_DISABLED = 'AUTH_002',
  EMAIL_NOT_VERIFIED = 'AUTH_003',
  INVALID_TOKEN = 'AUTH_004',
  TOKEN_EXPIRED = 'AUTH_005',
  INSUFFICIENT_PERMISSIONS = 'AUTH_006',
  
  // Validation errors
  VALIDATION_ERROR = 'VAL_001',
  INVALID_INPUT = 'VAL_002',
  MISSING_REQUIRED_FIELD = 'VAL_003',
  UNAUTHORIZED = 'VAL_004',
  
  // Resource errors
  RESOURCE_NOT_FOUND = 'RES_001',
  RESOURCE_ALREADY_EXISTS = 'RES_002',
  RESOURCE_CONFLICT = 'RES_003',
  
  // Server errors
  INTERNAL_ERROR = 'SRV_001',
  DATABASE_ERROR = 'SRV_002',
  EXTERNAL_SERVICE_ERROR = 'SRV_003',
  
  // Business logic errors
  BUSINESS_RULE_VIOLATION = 'BUS_001',
  OPERATION_NOT_ALLOWED = 'BUS_002',
  RATE_LIMIT_EXCEEDED = 'BUS_003',
}

/**
 * Generic API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    path?: string;
    method?: string;
    version?: string;
    pagination?: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

/**
 * Creates a success response
 * @param data The data to include in the response
 * @param message Success message
 * @returns ApiResponse with success true
 */
export const createSuccessResponse = <T>(data?: T, message: string = 'Operation successful'): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Creates an error response
 * @param code Error code
 * @param message Error message
 * @param details Additional error details
 * @returns ApiResponse with success false
 */
export const createErrorResponse = (
  code: ErrorCode,
  message: string = 'An error occurred',
  details?: any
): ApiResponse<null> => {
  return {
    success: false,
    message,
    error: {
      code,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Creates a paginated success response
 * @param data The data to include in the response
 * @param pagination Pagination information
 * @param message Success message
 * @returns ApiResponse with success true and pagination metadata
 */
export const createPaginatedResponse = <T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  },
  message: string = 'Operation successful'
): ApiResponse<T[]> => {
  return {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      pagination,
    },
  };
};

/**
 * Helper function to send a success response
 * @param res Express response object
 * @param data Data to send
 * @param message Success message
 * @param statusCode HTTP status code
 */
export const sendSuccessResponse = <T>(
  res: Response,
  data?: T,
  message: string = 'Operation successful',
  statusCode: HttpStatus = HttpStatus.OK
): void => {
  res.status(statusCode).json(createSuccessResponse(data, message));
};

/**
 * Helper function to send an error response
 * @param res Express response object
 * @param errorCode Error code
 * @param message Error message
 * @param statusCode HTTP status code
 * @param details Additional error details
 */
export const sendErrorResponse = (
  res: Response,
  errorCode: ErrorCode,
  message: string = 'An error occurred',
  statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: any
): void => {
  res.status(statusCode).json(createErrorResponse(errorCode, message, details));
};

/**
 * Helper function to send a paginated response
 * @param res Express response object
 * @param data Data array to send
 * @param pagination Pagination information
 * @param message Success message
 * @param statusCode HTTP status code
 */
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  },
  message: string = 'Operation successful',
  statusCode: HttpStatus = HttpStatus.OK
): void => {
  res.status(statusCode).json(createPaginatedResponse(data, pagination, message));
};