# Vite React TypeScript

Vite + React + Tailwind frontend with JWT authentication, protected routes, and Todo CRUD wired to a REST backend.

## Quick Start

```bash
npx tempora-cli init vite-ts my-app
```

## Stack

- Vite 5
- React 18
- TypeScript 5
- Tailwind CSS 3
- Axios (with JWT interceptor)
- React Router 6

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open http://localhost:5173

## Environment Variables

```env
VITE_API_URL=http://localhost:3000
```

## Pages

- `/login` — Login form
- `/signup` — Signup form
- `/dashboard` — Home (protected)
- `/dashboard/todos` — Todo CRUD (protected)

## Connecting to the Backend

Point `VITE_API_URL` at any running `express-mysql` or `fastify-mysql` backend. JWT is automatically attached to every request via an Axios interceptor.

---

Documentation: [tempora.irbaye.com](https://tempora.irbaye.com)
