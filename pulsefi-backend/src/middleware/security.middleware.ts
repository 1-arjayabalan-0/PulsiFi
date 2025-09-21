import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';

/**
 * Configure and apply security headers using helmet
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

/**
 * Configure CORS options
 */
export const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  credentials: true,
  maxAge: 86400, // 24 hours in seconds
};

/**
 * Apply CORS middleware
 */
export const corsMiddleware = cors(corsOptions);

/**
 * Add custom security headers
 */
export const addCustomSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent browsers from detecting the MIME type if it's different from Content-Type
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable strict XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Disable caching for sensitive routes
  if (req.path.startsWith('/api/auth')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  
  next();
};

/**
 * Apply all security middleware to the Express app
 */
export const applySecurityHeaders = (app: any) => {
  // Apply helmet security headers
  app.use(securityHeaders);
  
  // Apply CORS middleware
  app.use(corsMiddleware);
  
  // Apply custom security headers
  app.use(addCustomSecurityHeaders);
};