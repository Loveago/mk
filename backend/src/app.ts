import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { router as authRouter } from './modules/auth/auth.routes.js';
import { router as usersRouter } from './modules/users/users.routes.js';
import { router as vendorsRouter } from './modules/vendors/vendors.routes.js';
import { router as categoriesRouter } from './modules/categories/categories.routes.js';
import { router as productsRouter } from './modules/products/products.routes.js';
import { router as ordersRouter } from './modules/orders/orders.routes.js';
import { router as paymentsRouter } from './modules/payments/payments.routes.js';
import { router as shippingRouter } from './modules/shipping/shipping.routes.js';
import { router as reviewsRouter } from './modules/reviews/reviews.routes.js';
import { router as promotionsRouter } from './modules/promotions/promotions.routes.js';
import { router as settingsRouter } from './modules/settings/settings.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend', env: env.NODE_ENV });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/shipping', shippingRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/promotions', promotionsRouter);
app.use('/api/settings', settingsRouter);

app.use(errorHandler);

export default app;


