import { Router } from 'express';
import { listVendors, approveVendor, getVendorMe } from './vendors.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

export const router = Router();

router.get('/', requireAuth, requireRole('ADMIN'), listVendors);
router.post('/:id/approve', requireAuth, requireRole('ADMIN'), approveVendor);
router.get('/me', requireAuth, requireRole('VENDOR'), getVendorMe);


