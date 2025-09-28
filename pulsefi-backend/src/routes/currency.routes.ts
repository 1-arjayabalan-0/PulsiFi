import { Router } from 'express';
import { getAllCurrencies, getCurrencyByCode } from '../controllers/currency.controller';

const router = Router();

// Get all currencies
router.get('/', getAllCurrencies);

// Get currency by code
router.get('/:code', getCurrencyByCode);

export default router;