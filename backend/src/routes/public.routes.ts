import { Router } from 'express';
import { getHomeContent } from '@controllers/public.controller';

const router = Router();

/**
 * @openapi
 * /api/public/home:
 *   get:
 *     summary: Public home page content
 */
router.get('/home', getHomeContent);

export default router;


