import { Router } from 'express';
import { requireAuth } from '@middleware/auth';
import { requireRole } from '@middleware/roles';
import { checkout } from '@controllers/payment.controller';

const router = Router();

/**
 * @openapi
 * /api/payments/checkout:
 *   post:
 *     summary: Initiate checkout
 */
router.post('/checkout', requireAuth, requireRole('CUSTOMER', 'ADMIN'), checkout);

export default router;


