import { Router } from 'express';
import { currentUser, login, refresh, register } from '@controllers/auth.controller';
import { requireAuth } from '@middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a user (customer or vendor)
 */
router.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login and get tokens
 */
router.post('/login', login);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 */
router.post('/refresh', refresh);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 */
router.get('/me', requireAuth, currentUser);

export default router;


