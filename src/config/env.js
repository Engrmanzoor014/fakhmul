import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'development-secret-change-me',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@fakhmul.local',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'change-this-strong-password',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'fakhmul_session',
  sessionTtlMs: Number(process.env.SESSION_TTL_MS || 1000 * 60 * 60 * 8),
  adminPassword: process.env.ADMIN_PASSWORD || 'change-this-strong-password',
};

export default env;
