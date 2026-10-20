import express from 'express';
import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/auth/login', (req, res) => {
  const { password } = req.body ?? {};

  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  const supplied = Buffer.from(password);
  const expected = Buffer.from(env.adminPassword);

  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const sessionId = crypto.randomUUID();
  const user = {
    id: 'admin',
    name: 'Administrator',
    role: 'admin',
    email: env.ADMIN_EMAIL,
  };

  req.app.locals.sessions.set(sessionId, {
    user,
    issuedAt: Date.now(),
    expiresAt: Date.now() + env.sessionTtlMs,
  });

  res.cookie(env.sessionCookieName, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
    maxAge: env.sessionTtlMs,
  });

  return res.json({ ok: true, user });
});

router.post('/auth/logout', (req, res) => {
  const sessionId = req.cookies?.[env.sessionCookieName];
  if (sessionId) {
    req.app.locals.sessions.delete(sessionId);
  }

  res.clearCookie(env.sessionCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
  });

  return res.json({ ok: true, message: 'Logged out.' });
});

router.get('/auth/me', requireAuth, (req, res) => {
  return res.json({ ok: true, user: req.session.user });
});

router.get('/products', (req, res) => {
  const products = [
    { id: 1, name: 'Premium Apricot Kernels', price: 420, category: 'nuts' },
    { id: 2, name: 'Roasted Walnut Mix', price: 560, category: 'nuts' },
    { id: 3, name: 'Gilgit Mulberry', price: 390, category: 'fruit' },
  ];

  return res.json({ ok: true, products });
});

router.get('/orders/my', requireAuth, (req, res) => {
  return res.json({
    ok: true,
    orders: [
      { id: 'ORD-1001', status: 'confirmed', total: 1450 },
      { id: 'ORD-1002', status: 'packed', total: 980 },
    ],
  });
});

router.get('/admin/overview', requireAdmin, (req, res) => {
  return res.json({
    ok: true,
    overview: {
      revenue: 125000,
      orders: 284,
      visitors: 2351,
      pendingOrders: 8,
      lowStockProducts: 12,
      topProduct: 'Aromatic Apricot',
    },
  });
});

router.post('/admin/products', requireAdmin, (req, res) => {
  return res.status(201).json({ ok: true, message: 'Product created.', product: req.body });
});

router.patch('/admin/products/:id', requireAdmin, (req, res) => {
  return res.json({ ok: true, message: 'Product updated.', id: req.params.id, updates: req.body });
});

router.patch('/admin/orders/:id/status', requireAdmin, (req, res) => {
  return res.json({ ok: true, message: 'Order status updated.', id: req.params.id, status: req.body.status });
});

export { router as authRouter };
