import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSessionStore, seedProducts, seedAdminUser, getSessionFromRequest } from './db/index.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import env from './config/env.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

app.disable('x-powered-by');
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      connectSrc: ["'self'"],
    }
  }
}));
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.locals.sessionStore = createSessionStore();
app.locals.products = seedProducts();
seedAdminUser(app.locals);

app.get('/api/v1/health', (req, res) => {
  res.json({
    ok: true,
    service: 'fakhmul',
    environment: env.NODE_ENV,
    authenticated: Boolean(getSessionFromRequest(req))
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(express.static(rootDir));

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-login.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-dashboard.html'));
});

app.get('/admin-order', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-order.html'));
});

app.get('/admin-analytics', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-analytics.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

export default app;
