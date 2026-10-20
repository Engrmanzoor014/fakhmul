import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'development-secret-change-me',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@fakhmul.local',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'change-this-strong-password',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
