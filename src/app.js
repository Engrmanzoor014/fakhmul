import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { env } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { getSession } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const sessions = new Map();
app.locals.sessions = sessions;

app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));
app.use(rateLimit({
  windowMs: 60_000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use((req, res, next) => {
  req.session = getSession(req) || null;
  next();
});

app.get('/api/v1/health', (req, res) => {
  return res.json({ ok: true, status: 'ok' });
});

app.use('/api/v1', authRouter);
app.use('/api/v1/admin', adminRouter);

const protectedAdminPages = new Set([
  '/admin-dashboard.html',
  '/admin-order.html',
  '/admin-analytics.html',
  '/admin-customers.html',
]);

for (const page of protectedAdminPages) {
  app.get(page, (req, res, next) => {
    if (!req.session || req.session.user?.role !== 'admin') {
      return res.redirect('/admin-login.html');
    }
    return next();
  });
}

app.use(express.static(rootDir, { index: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/admin-login.html', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-login.html'));
});

app.get('/admin-dashboard.html', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-dashboard.html'));
});

app.get('/admin-order.html', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-order.html'));
});

app.get('/admin-analytics.html', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-analytics.html'));
});

app.get('/admin-customers.html', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-customers.html'));
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Not found.' });
});

export default app;
