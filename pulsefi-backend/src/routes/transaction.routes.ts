import { Router } from 'express';
import { createTransaction, getTransactionsByAccount, getTransactionById, updateTransaction, deleteTransaction, getAllTransactions } from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all transactions for user
router.get('/', getAllTransactions);

// Create transaction
router.post(
  '/',
  [
    body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('categoryId').optional().isUUID().withMessage('Category ID must be a valid UUID'),
    body('date').isISO8601().withMessage('Date must be in ISO format'),
    body('accountId').isUUID().withMessage('Valid account ID is required')
  ],
  createTransaction
);

// Get transactions by account
router.get(
  '/account/:accountId',
  [
    param('accountId').isUUID().withMessage('Invalid account ID')
  ],
  getTransactionsByAccount
);

// Get transaction by ID
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid transaction ID')
  ],
  getTransactionById
);

// Update transaction
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid transaction ID'),
    body('type').optional().isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
    body('amount').optional().isNumeric().withMessage('Amount must be a number'),
    body('categoryId').optional().isUUID().withMessage('Category ID must be a valid UUID'),
    body('date').optional().isISO8601().withMessage('Date must be in ISO format')
  ],
  updateTransaction
);

// Delete transaction
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid transaction ID')
  ],
  deleteTransaction
);

export default router;