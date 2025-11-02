import { Router } from 'express';
import { requireAuth } from '@middleware/auth';
import { requireRole } from '@middleware/roles';
import { createOrder, getMyOrders, listAllOrders, listVendorOrders, updateOrderStatus } from '@controllers/order.controller';

const router = Router();

// Customer
router.post('/', requireAuth, requireRole('CUSTOMER', 'ADMIN'), createOrder);
router.get('/me', requireAuth, requireRole('CUSTOMER', 'ADMIN'), getMyOrders);

// Vendor
router.get('/vendor', requireAuth, requireRole('VENDOR', 'ADMIN'), listVendorOrders);

// Admin
router.get('/', requireAuth, requireRole('ADMIN'), listAllOrders);
router.put('/:id/status', requireAuth, requireRole('ADMIN'), updateOrderStatus);

export default router;


