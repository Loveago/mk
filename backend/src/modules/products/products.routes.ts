import { Router } from 'express';
import { listProducts, createProduct, getProductBySlug } from './products.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

export const router = Router();

router.get('/', listProducts);
router.get('/:slug', getProductBySlug);
router.post('/', requireAuth, requireRole('VENDOR', 'ADMIN'), createProduct);


