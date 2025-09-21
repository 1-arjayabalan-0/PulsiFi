import { Router } from 'express';
import { updateProfile, getProfile } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get profile
router.get('/profile', getProfile);

// Update profile
router.put(
  '/profile',
  [
    body('firstName').optional().isString(),
    body('lastName').optional().isString(),
    body('avatar').optional().isString()
  ],
  updateProfile
);

export default router;