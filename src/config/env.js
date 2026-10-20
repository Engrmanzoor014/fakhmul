import dotenv from 'dotenv';

dotenv.config();

const sessionCookieName = 'fakhmul_session';
const sessionTtlMs = 1000 * 60 * 60 * 12;
const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-strong-password';

export const env = {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
  DATABASE_URL: process.env.DATABASE_URL || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'development-secret-change-me',
  sessionCookieName,
  sessionTtlMs,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@fakhmul.local',
  ADMIN_PASSWORD: adminPassword,
  adminPassword,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export default env;
