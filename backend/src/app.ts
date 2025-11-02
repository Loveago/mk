import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from '@config/env';
import routes from '@routes/index';
import { errorHandler } from '@middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@config/swagger';

const app = express();

app.use(helmet());

const defaultAllowedOrigins = [
  env.frontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const additionalOrigins = (process.env.ADDITIONAL_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...additionalOrigins])].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow REST tools without an Origin header (like curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow common LAN dev hosts (e.g., http://192.168.x.x:5173)
      const lanMatch = /^http:\/\/192\.168\.[0-9]+\.[0-9]+(:[0-9]+)?$/.test(origin);
      if (lanMatch) return callback(null, true);
      return callback(new Error(`CORS: Origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', routes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;


