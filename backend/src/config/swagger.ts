import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '@config/env';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'MK Marketplace API',
      version: '0.1.0',
    },
    servers: [{ url: env.appUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['src/routes/**/*.ts'],
});


