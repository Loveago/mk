import { Router } from 'express';
import { initPayment, webhook } from './payments.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

export const router = Router();

router.post('/init', requireAuth, requireRole('CUSTOMER'), initPayment);
router.post('/webhook', webhook);


