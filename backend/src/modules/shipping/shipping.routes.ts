import { Router } from 'express';
import { listRegions, createShipment, updateShipment } from './shipping.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

export const router = Router();

router.get('/regions', listRegions);
router.post('/', requireAuth, requireRole('ADMIN', 'VENDOR'), createShipment);
router.patch('/:id', requireAuth, requireRole('ADMIN', 'VENDOR'), updateShipment);


