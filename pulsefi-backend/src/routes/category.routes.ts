import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  hardDeleteCategory
} from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Validation rules
const categoryValidation = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Category name must be between 1 and 100 characters')
      .trim(),
    body('type')
      .isIn(['income', 'expense', 'both'])
      .withMessage('Type must be either income, expense, or both'),
    body('color')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Color must be a valid hex color code'),
    body('icon')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Icon must be between 1 and 50 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
      .trim()
  ],
  update: [
    body('name')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Category name must be between 1 and 100 characters')
      .trim(),
    body('type')
      .optional()
      .isIn(['income', 'expense', 'both'])
      .withMessage('Type must be either income, expense, or both'),
    body('color')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Color must be a valid hex color code'),
    body('icon')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Icon must be between 1 and 50 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
      .trim(),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value')
  ]
};

// Query validation
const queryValidation = [
  query('type')
    .optional()
    .isIn(['income', 'expense', 'both'])
    .withMessage('Type must be either income, expense, or both'),
  query('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Routes
router.get('/', authenticate, queryValidation, getAllCategories);
router.get('/:id', authenticate, getCategoryById);
router.post('/', authenticate, categoryValidation.create, createCategory);
router.put('/:id', authenticate, categoryValidation.update, updateCategory);
router.delete('/:id', authenticate, deleteCategory);
router.delete('/:id/hard', authenticate, hardDeleteCategory);

export default router;