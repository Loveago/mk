import { Router } from 'express';
import { getSettings, updateSettings } from './settings.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

export const router = Router();

router.get('/', getSettings);
router.put('/', requireAuth, requireRole('ADMIN'), updateSettings);


