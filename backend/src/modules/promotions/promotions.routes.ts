import { Router } from 'express';
import { listPromotions, createPromotion } from './promotions.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

export const router = Router();

router.get('/', listPromotions);
router.post('/', requireAuth, requireRole('ADMIN'), createPromotion);


