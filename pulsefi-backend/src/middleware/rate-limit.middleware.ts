import rateLimit from 'express-rate-limit';
import { ErrorCode, HttpStatus } from '../utils/response.utils';
import { createErrorResponse } from '../utils/response.utils';

// Rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const response = createErrorResponse(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Too many login attempts, please try again after 15 minutes',
      { retryAfter: Math.ceil(15 * 60) } // in seconds
    );
    res.status(HttpStatus.TOO_MANY_REQUESTS).json(response);
  },
  skipSuccessfulRequests: true, // Don't count successful logins against the rate limit
});

// Rate limiter for registration
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 accounts per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const response = createErrorResponse(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Too many accounts created, please try again after an hour',
      { retryAfter: Math.ceil(60 * 60) } // in seconds
    );
    res.status(HttpStatus.TOO_MANY_REQUESTS).json(response);
  },
});

// Rate limiter for token refresh
export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const response = createErrorResponse(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Too many token refresh attempts, please try again later',
      { retryAfter: Math.ceil(15 * 60) } // in seconds
    );
    res.status(HttpStatus.TOO_MANY_REQUESTS).json(response);
  },
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const response = createErrorResponse(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Too many requests, please try again later',
      { retryAfter: Math.ceil(10 * 60) } // in seconds
    );
    res.status(HttpStatus.TOO_MANY_REQUESTS).json(response);
  },
});