import { Router } from 'express';
import { addReview, listReviews } from './reviews.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

export const router = Router();

router.get('/:productId', listReviews);
router.post('/:productId', requireAuth, requireRole('CUSTOMER'), addReview);


