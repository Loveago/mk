import { Router } from 'express';
import { login, registerCustomer, registerVendor, me } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

export const router = Router();

router.post('/login', login);
router.post('/register/customer', registerCustomer);
router.post('/register/vendor', registerVendor);
router.get('/me', requireAuth, me);


