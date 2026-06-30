# Fastify MySQL TypeScript

Fastify REST API with MySQL, Prisma ORM, JWT authentication, Swagger docs, and Docker support.

## Quick Start

```bash
npx tempora-cli init fastify-mysql my-app
```

## Stack

- Fastify 4
- TypeScript 5
- Prisma 5
- MySQL 8
- @fastify/jwt
- @fastify/swagger + @fastify/swagger-ui
- Docker + Docker Compose
- Node.js 20

## Running with Docker

```bash
docker compose up

# First run only — run migrations in a second terminal
docker exec fastify_mysql_app pnpm prisma migrate dev --name init

# Visit API docs
open http://localhost:3000/api/docs
```

## Running Locally

```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev --name init
pnpm dev
```

## API Routes

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |

### Todos
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/todos | Protected |
| POST | /api/todos | Protected |
| PUT | /api/todos/:id | Protected |
| DELETE | /api/todos/:id | Protected |

---

Documentation: [tempora.irbaye.com](https://tempora.irbaye.com)
