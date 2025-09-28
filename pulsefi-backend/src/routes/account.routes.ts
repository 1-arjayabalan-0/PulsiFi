import { Router } from 'express';
import { createAccount, getAccountById, updateAccount, deleteAccount, getAllAccounts } from '../controllers/account.controller';
import { authenticate } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all accounts for user
router.get('/', getAllAccounts);

// Create account
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Account name is required'),
    body('type').notEmpty().withMessage('Account type is required'),
    body('balance').optional().isNumeric().withMessage('Balance must be a number'),
    body('portfolioId').isUUID().withMessage('Valid portfolio ID is required'),
    body('parentId').optional().isUUID().withMessage('Parent account ID must be valid')
  ],
  createAccount
);

// Get account by ID
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid account ID')
  ],
  getAccountById
);

// Update account
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid account ID'),
    body('name').optional().notEmpty().withMessage('Account name cannot be empty'),
    body('type').optional().notEmpty().withMessage('Account type cannot be empty')
  ],
  updateAccount
);

// Delete account
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid account ID')
  ],
  deleteAccount
);

export default router;