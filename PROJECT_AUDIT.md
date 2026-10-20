# FAKHMUL Project Audit

## 1) Executive summary

The repository is a static HTML storefront and admin UI with no backend service, no database layer, and no application runtime configuration. The app is currently branded as FAKHMUL and contains a custom storefront landing page plus several admin pages for analytics, orders, customers, and product management.

The most important issue is the admin authentication model: `admin-login.html` embeds a hardcoded admin password and stores the authentication state in `sessionStorage`. That is not a secure authentication mechanism and must be replaced with server-side session authentication.

There is no evidence of a working PostgreSQL database, Prisma schema, API server, or production deployment configuration. The project is a front-end-only prototype that can be repurposed into a secure full-stack app, but it needs a disciplined backend implementation and security hardening before production use.

## 2) Repository inventory

Included files and folders observed in the current repository:

- Root HTML pages:
  - `index.html` — storefront landing page and product listing UI
  - `admin-login.html` — admin login screen with hardcoded password
  - `admin-dashboard.html` — admin product management page
  - `admin-analytics.html` — admin analytics dashboard
  - `admin-customers.html` — customer management UI
  - `admin-order.html` — order management UI
  - `Admin-guide.html` — admin documentation page
  - `check.html`, `demo.html`, `test.html` — likely prototype/test/demo pages
- Asset folders:
  - `/images` — product and brand images
  - `/video` — promotional video assets
  - `/other` — extra HTML/demo content

## 3) Architecture and implementation findings

### Current state

- Frontend: static HTML/CSS/JavaScript with embedded styles and scripts.
- Backend: none discovered.
- Database: none discovered.
- Authentication: insecure browser-only check via `sessionStorage`.
- Security controls: none beyond basic browser UI behaviors.
- Dependencies: no Node project manifest, no server runtime, no package management.
- Config management: no `.env.example`, no secure `.gitignore`, no deployment config.

### Observed code risks

1. Critical — hardcoded password in `admin-login.html`
   - Password value: `fakhmul2024`
   - Login logic compares a plaintext string in browser JavaScript.
   - This is not server-side authentication and is trivially bypassable.

2. Critical — sessionStorage used as auth proof
   - `sessionStorage.setItem('fakhmul_admin', 'true')` marks a user as authenticated.
   - Browser storage is not secure and can be tampered with by any script running in the page context.
   - Any user can open DevTools and set those values to bypass the UI guard.

3. High — no server-side authorization
   - The admin pages check `sessionStorage` only in the browser.
   - There are no protected API endpoints or server-side permission checks.

4. High — no data persistence or validation layer
   - Product and order data appear to be simulated or embedded in front-end JavaScript.
   - No database-backed source of truth exists.

5. High — no API boundary or backend
   - No route-level validation, no request parsing, no rate limiting, no role enforcement.
   - No checkout or order processing endpoints exist.

6. Medium — demo/test pages and unused files
   - `demo.html`, `test.html`, `check.html`, and `other/cv.html` may be leftover prototype content.
   - These pages can confuse deployment and maintenance if they are not clearly separated from production pages.

7. Medium — no environment management
   - No `.env` handling and no production credentials separation.
   - No secret rotation or production environment diagram.

8. Medium — no dependency and security hygiene
   - No `package.json`, no audit process, no lockfile, no vulnerability scanning baseline.

## 4) Security risk classification

### Critical
- Hardcoded admin credential in front-end source.
- Browser-only authentication using `sessionStorage`.
- No server-side auth or protected routes.

### High
- No database-backed authorization model.
- No server-side validation or request sanitization.
- No CSRF or secure cookies.
- No rate limiting or failed-login enforcement.
- No production HTTPS or security headers.

### Medium
- Mock/demo data embedded in the UI.
- Missing health checks and monitoring config.
- No structured logging or audit trail.

### Low
- Legacy static HTML structure with strong brand preservation but little maintainability.
- Some pages not clearly production-ready and may be kept for reference only.

## 5) Technical conclusions

There is no existing backend or database infrastructure suitable for production. The project should be re-architected around a secure Node.js + Express API with PostgreSQL and Prisma, while preserving the current HTML storefront and admin design. The current front-end should remain as a UI shell, but its admin logic must be moved to real server-side session authentication.

## 6) Proposed implementation plan

### Phase 1: Secure the admin flow
- Replace hardcoded admin password logic.
- Add server-side authentication endpoints.
- Use secure HTTP-only session cookies.
- Add rate limiting and failed-login controls.
- Protect admin APIs and admin pages.

### Phase 2: Add the backend foundation
- Initialize Node.js + Express with ES modules.
- Add Prisma schema for products, users, orders, stock, etc.
- Configure PostgreSQL-backed session store and environment variables.
- Add migrations and seed data.

### Phase 3: Add real e-commerce services
- Products API with category and stock support.
- Cart and checkout flow with server-side validation.
- Order creation and status tracking.
- Admin inventory and analytics endpoints.

### Phase 4: Harden and verify
- Input validation with Zod.
- CSRF protection for cookie-authenticated state-changing requests.
- Security headers and CORS policy.
- Test coverage for auth, inventory, and order flows.
- Document startup, migration, production, and release steps.

## 7) Immediate action

The repository must be converted from a static mock site into a secure app with:

- a real API layer,
- server-side sessions,
- database-backed product and order data,
- protected admin endpoints,
- environment-based configuration,
- and production hardening.

This should be done without deleting the existing brand assets and page structure unless they are clearly obsolete or unsafe.

## 8) Recommended target stack

- Frontend: existing HTML/CSS/vanilla JS preserved where practical
- Backend: Node.js + Express (ES modules)
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Auth: secure server-managed sessions with HttpOnly cookies
- Password hashing: Argon2id
- Session management: PostgreSQL-backed session store in production
- Testing: Node.js test runner + Supertest

## 9) Risk summary

The current product is not production-ready and should be treated as a front-end prototype. The single most urgent issue is the insecure admin authentication, followed by the absence of any server-side security or persistence layer. Until these are fixed, the project is not safe to deploy or expose publicly.
