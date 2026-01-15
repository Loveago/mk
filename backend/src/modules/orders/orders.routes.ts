import { Router } from 'express';
import { createOrder, listMyOrders, listAllOrders, updateOrderStatus } from './orders.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

export const router = Router();

router.post('/', requireAuth, requireRole('CUSTOMER'), createOrder);
router.get('/me', requireAuth, requireRole('CUSTOMER'), listMyOrders);
router.get('/', requireAuth, requireRole('ADMIN'), listAllOrders);
router.patch('/:id/status', requireAuth, requireRole('ADMIN', 'VENDOR'), updateOrderStatus);


