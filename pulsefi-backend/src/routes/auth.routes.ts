import { Router, Request, Response } from 'express';
import { register, login, getMe, refreshToken, logout, logoutAll } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { loginLimiter, registerLimiter, refreshTokenLimiter } from '../middleware/rate-limit.middleware';
import { body, validationResult } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();

// Register route with validation and rate limiting
router.post(
  '/register',
  registerLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('name').isString().withMessage('Name is required')
  ],
  validateRequest,
  register
);

// Login route with validation and rate limiting
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
);

// Refresh token route with rate limiting
router.post(
  '/refresh-token',
  refreshTokenLimiter,
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ],
  validateRequest,
  refreshToken
);

// Logout route
router.post(
  '/logout',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ],
  validateRequest,
  logout
);

// Logout from all devices route (requires authentication)
router.post(
  '/logout-all',
  authenticate,
  logoutAll
);

// Get current user profile (requires authentication)
router.get(
  '/me',
  authenticate,
  getMe
);

// Logout from all devices route (protected)
router.post('/logout-all', authenticate, logoutAll);

// Email verification route
router.get('/verify-email/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  
  // TODO: Implement email verification
  // const verified = await verifyEmail(token);
  
  // if (verified) {
  //   return res.status(200).json({ message: 'Email verified successfully' });
  // }
  
  return res.status(501).json({ message: 'Email verification not implemented yet' });
});

// Request password reset route
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { email } = req.body;
      // TODO: Implement password reset token creation
      // const token = await createPasswordResetToken(email);
      
      // if (!token) {
      //   // Don't reveal if the email exists or not for security reasons
      //   return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
      // }
      
      // In a real application, you would send an email with the reset link
      // sendPasswordResetEmail(email, token);
      
      return res.status(501).json({ message: 'Password reset not implemented yet' });
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Reset password route
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { token, password } = req.body;
      
      // TODO: Implement password reset functionality
      // Validate password strength
      // const passwordValidation = validatePassword(password);
      // if (!passwordValidation.valid) {
      //   return res.status(400).json({ message: passwordValidation.message });
      // }
      
      // const userId = await verifyPasswordResetToken(token);
      
      // if (!userId) {
      //   return res.status(400).json({ message: 'Invalid or expired reset token' });
      // }
      
      // const hashedPassword = await hashPassword(password);
      // const success = await resetPassword(userId, hashedPassword);
      
      // if (success) {
      //   return res.status(200).json({ message: 'Password reset successful' });
      // }
      
      return res.status(501).json({ message: 'Password reset not implemented yet' });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user route (protected)
router.get('/me', authenticate, getMe);

export default router;