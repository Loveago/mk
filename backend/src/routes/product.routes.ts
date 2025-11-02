import { Router } from 'express';
import { requireAuth } from '@middleware/auth';
import { requireRole } from '@middleware/roles';
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from '@controllers/product.controller';

const router = Router();

// Public
router.get('/', listProducts);
router.get('/:id', getProduct);

// Vendor/Admin
router.post('/', requireAuth, requireRole('VENDOR', 'ADMIN'), createProduct);
router.put('/:id', requireAuth, requireRole('VENDOR', 'ADMIN'), updateProduct);
router.delete('/:id', requireAuth, requireRole('VENDOR', 'ADMIN'), deleteProduct);

export default router;


