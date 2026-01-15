import { Router } from 'express';
import { listCategories, createCategory } from './categories.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

export const router = Router();

router.get('/', listCategories);
router.post('/', requireAuth, requireRole('ADMIN'), createCategory);


