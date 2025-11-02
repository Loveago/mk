import { Router } from 'express';
import { requireAuth } from '@middleware/auth';
import { requireRole } from '@middleware/roles';
import { createCategory, deleteCategory, listCategories, updateCategory } from '@controllers/category.controller';

const router = Router();

// Public
router.get('/', listCategories);

// Admin
router.post('/', requireAuth, requireRole('ADMIN'), createCategory);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateCategory);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteCategory);

export default router;


