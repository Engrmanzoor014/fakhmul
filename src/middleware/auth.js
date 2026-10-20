import { env } from '../config/env.js';

export function getSession(req) {
  const sessionId = req.cookies?.[env.sessionCookieName];
  if (!sessionId) return null;

  const session = req.app.locals.sessions?.get(sessionId) ?? null;
  return session;
}

export function isAuthenticated(req) {
  return Boolean(getSession(req)?.user);
}

export function requireAuth(req, res, next) {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  req.session = session;
  return next();
}

export function requireAdmin(req, res, next) {
  const session = getSession(req);
  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  req.session = session;
  return next();
}
