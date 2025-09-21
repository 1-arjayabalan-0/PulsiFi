import { Router } from 'express';
import { createPortfolio, getUserPortfolios, getPortfolioById, updatePortfolio, deletePortfolio } from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create portfolio
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Portfolio name is required'),
    body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code')
  ],
  createPortfolio
);

// Get all portfolios for user
router.get('/', getUserPortfolios);

// Get portfolio by ID
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid portfolio ID')
  ],
  getPortfolioById
);

// Update portfolio
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid portfolio ID'),
    body('name').optional().notEmpty().withMessage('Portfolio name cannot be empty'),
    body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code')
  ],
  updatePortfolio
);

// Delete portfolio
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid portfolio ID')
  ],
  deletePortfolio
);

export default router;