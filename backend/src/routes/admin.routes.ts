import { Router } from 'express';
import {
  createPage,
  createPromotion,
  deletePage,
  deletePromotion,
  getAdminSummary,
  listPages,
  listPromotions,
  listUsers,
  listVendors,
  updatePage,
  updatePromotion,
  updateUserStatus,
  updateVendorStatus,
} from '@controllers/admin.controller';
import { requireAuth } from '@middleware/auth';
import { requireRole } from '@middleware/roles';

const router = Router();

router.use(requireAuth);
router.use(requireRole('ADMIN'));

/**
 * @openapi
 * /api/admin/summary:
 *   get:
 *     summary: Overview statistics for admin dashboard
 */
router.get('/summary', getAdminSummary);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: List users
 */
router.get('/users', listUsers);

/**
 * @openapi
 * /api/admin/users/{id}/status:
 *   patch:
 *     summary: Update user status (ACTIVE/SUSPENDED/PENDING)
 */
router.patch('/users/:id/status', updateUserStatus);

/**
 * @openapi
 * /api/admin/vendors:
 *   get:
 *     summary: List vendors with metrics
 */
router.get('/vendors', listVendors);

/**
 * @openapi
 * /api/admin/vendors/{id}/status:
 *   patch:
 *     summary: Update vendor status (approve/suspend/activate)
 */
router.patch('/vendors/:id/status', updateVendorStatus);

router.get('/promotions', listPromotions);
router.post('/promotions', createPromotion);
router.patch('/promotions/:id', updatePromotion);
router.delete('/promotions/:id', deletePromotion);

router.get('/pages', listPages);
router.post('/pages', createPage);
router.patch('/pages/:id', updatePage);
router.delete('/pages/:id', deletePage);

export default router;


