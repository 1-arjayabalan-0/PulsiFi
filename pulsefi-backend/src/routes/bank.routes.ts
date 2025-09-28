import { Router } from 'express';
import { createBank, getAllBanks, getBankById, updateBank, deleteBank } from '../controllers/bank.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Bank routes
router.post('/', createBank);
router.get('/', getAllBanks);
router.get('/:id', getBankById);
router.put('/:id', updateBank);
router.delete('/:id', deleteBank);

export default router;