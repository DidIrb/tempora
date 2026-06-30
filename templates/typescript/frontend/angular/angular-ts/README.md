# Angular TypeScript

Angular + Tailwind frontend with JWT authentication, route guards, and Todo CRUD wired to a REST backend.

## Quick Start

```bash
npx tempora-cli init angular-ts my-app
```

## Stack

- Angular 17 (standalone components)
- TypeScript 5
- Tailwind CSS 3
- RxJS
- Functional HTTP interceptor for JWT

## Getting Started

```bash
pnpm install
pnpm start
```

Open http://localhost:4200

## Environment

Edit `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

## Pages

- `/login` — Login form
- `/signup` — Signup form
- `/dashboard` — Home (protected by authGuard)
- `/dashboard/todos` — Todo CRUD (protected)

## Connecting to the Backend

Point `apiUrl` in the environment file at any running `express-mysql`, `fastify-mysql`, or `spring-boot-mysql` backend. JWT is automatically attached to every request via a functional HTTP interceptor.

---

Documentation: [tempora.irbaye.com](https://tempora.irbaye.com)
