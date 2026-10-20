# FAKHMUL

A secure starter for the FAKHMUL storefront and admin infrastructure.

## Tech stack

- Frontend: existing static HTML/CSS/JS storefront kept in place
- Backend: Node.js + Express (ES modules)
- Database: PostgreSQL-ready Prisma schema
- Auth: server-managed sessions with HttpOnly cookies
- Password hashing: Argon2id
- Validation: Zod
- Security: Helmet, CORS, rate limiting, CSRF-ready cookie handling

## Quick start

1. Copy `.env.example` to `.env` and configure values.
2. Install dependencies:
   npm install
3. Generate Prisma client:
   npm run prisma:generate
4. Start the server:
   npm start

## Local development

- `npm run dev` for file watching
- `npm test` for automated checks

## Notes

This repository contains the static storefront pages and an Express API scaffold. The app is intentionally designed to preserve the current branding while moving authentication and authorization to server-side controls.

Production PostgreSQL is required for persisted data. In this workspace, a live database service is not available, so the app starts with the in-memory fallback store until `DATABASE_URL` and a database service are configured.

## Important security requirements

- Never commit `.env` or actual production secrets.
- Use strong admin credentials in environment variables.
- Do not treat `sessionStorage` as an auth signal.
- Use HTTPS in production.
- Protect all admin routes from server-side authorization.

## API overview

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `POST /api/v1/orders`
- `GET /api/v1/orders/my`
- `GET /api/v1/admin/overview`
- `POST /api/v1/admin/products`
- `PATCH /api/v1/admin/products/:id`
- `PATCH /api/v1/admin/orders/:id/status`

## Production deployment checklist

- Configure a real PostgreSQL instance.
- Set `SESSION_SECRET` to a secure random value.
- Use HTTPS on all public endpoints.
- Restrict CORS and add CSRF protection for state-changing requests.
- Add a proper session store and persistence layer for production.
- Run Prisma migrations before deployment.

