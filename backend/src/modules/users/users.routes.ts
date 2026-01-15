import { Router } from 'express';
import { listUsers, updateUserStatus } from './users.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

export const router = Router();

router.get('/', requireAuth, requireRole('ADMIN'), listUsers);
router.patch('/:id/status', requireAuth, requireRole('ADMIN'), updateUserStatus);


