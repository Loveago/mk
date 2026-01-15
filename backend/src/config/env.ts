import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string, defaultValue?: string): string {
  const val = process.env[name] ?? defaultValue;
  if (!val) {
    throw new Error(`Missing required env var ${name}`);
  }
  return val;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  PLATFORM_NAME: process.env.PLATFORM_NAME ?? 'MyGhanaMarketplace',
  DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY ?? 'GHS',
  TIMEZONE: process.env.TIMEZONE ?? 'Africa/Accra',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? 'admin@myghanamarketplace.local',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:3000'
};


