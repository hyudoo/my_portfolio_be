# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn start:dev          # Dev server with watch mode (port 3023)
yarn build              # Compile TypeScript to dist/

# Code quality
yarn lint               # ESLint with auto-fix
yarn format             # Prettier formatting

# Testing
yarn test               # Unit tests
yarn test:watch         # Unit tests in watch mode
yarn test:cov           # Coverage report
yarn test:e2e           # End-to-end tests

# Database
yarn typeorm migration:run      # Apply pending migrations
yarn typeorm migration:revert   # Revert last migration
yarn typeorm migration:generate -- src/database/migrations/<Name>  # Generate migration from entity changes
```

## Environment Setup

Copy `.env.example` to `.env` and fill in values. Required variables:
- `DB_*` — PostgreSQL connection (host, port, username, password, name)
- `REDIS_*` — Redis connection for BullMQ email queue
- `JWT_SECRET_KEY`, `JWT_EXPIRATION` — JWT auth config
- `SMTP_*` — Gmail SMTP credentials for sending emails
- `FE_APP_URL` — Frontend URL used in email verification links

Start dependencies with Docker: `docker-compose up -d db redis`

Swagger UI is available at `http://localhost:3023/api` during development.

## Architecture

**NestJS + TypeScript** REST API with PostgreSQL (TypeORM) and Redis (BullMQ).

### Module Structure (`src/modules/`)

- **auth** — JWT authentication: login, register, password reset, email verification. Uses Passport JWT strategy and custom guards/decorators.
- **user** — User CRUD with soft delete. Paginated listing with filtering.
- **mail** — BullMQ-backed async email queue. Processes verification and password reset emails via SMTP.

### Authentication & Authorization

Guards and decorators live in `src/modules/auth/`:
- `AppGuard` — global guard; applies JWT + permission check to all routes
- `@Auth()` — marks route as requiring authentication
- `@PermitAll()` — bypasses auth guard (public routes)
- `@RequiredPermission('action')` — requires specific RBAC permission
- `@AuthUser()` — parameter decorator to inject the current user from JWT payload

### Database (`src/database/`)

TypeORM entities with relationships:
- `User` ↔ `Role` (Many-to-Many via `user_roles`)
- `Role` ↔ `Permission` (Many-to-Many via `role_permissions`)
- `User` → `VerificationCode` (One-to-Many, cascade delete)

Users have soft delete (`deletedAt`). Migrations live in `src/database/migrations/`. Seeders in `src/database/seeders/` initialize admin/user roles and permissions.

Use `typeorm-transactional` decorators (`@Transactional()`) for service methods that require atomicity.

### Email Queue

`MailModule` registers a BullMQ queue backed by Redis. The `MailProcessor` consumes jobs and sends emails via Nodemailer. To send email, inject `MailService` and call the appropriate method — it enqueues a job rather than sending synchronously.

### Utilities (`src/utils/`)

#### Concurrency — `semaphore/`

Redis-backed primitives built on `redis-semaphore`. Default timeouts: `acquireTimeout` 300 s, `lockTimeout` 60 s.

- **`AppMutex`** — exclusive lock (1 holder). Methods: `tryAcquire()`, `acquire()`, `runExclusive(callback)`.
- **`AppSemaphore`** — counting semaphore with a configurable `limit`. Wraps `MultiSemaphore`; all methods accept an optional `permits` argument. Methods: `tryAcquire(permits?)`, `acquire(permits?)`, `runExclusive(callback, permits?)`.
- **`RateLimiter`** — throttles concurrent calls within a rolling time window using `AppSemaphore` as a token pool.
  - `quota` — max concurrent tokens; `perMilliseconds` — window length.
  - `mode: RateLimitMode.AtRequest` (token held for the full window from call start) vs `AtCompletion` (default; token held for `perMilliseconds` after the action finishes).
  - `execute(action, { cost? })` — acquires `cost` tokens, runs the action, then schedules release.
  - `cancelAll()` — increments a signal so in-flight `acquire` calls abandon their permits after acquisition.

Usage pattern:
```ts
// Mutex — at most one caller at a time
const mutex = new AppMutex("my-resource-key");
await mutex.runExclusive(async () => { /* critical section */ });

// Semaphore — at most N callers at a time
const sem = new AppSemaphore("my-resource-key", /* limit */ 5);
const release = await sem.acquire();
try { /* ... */ } finally { release(); }

// RateLimiter — at most 10 req/s (AtCompletion mode)
const limiter = new RateLimiter({ key: "api", quota: 10, perMilliseconds: 1000 });
const result = await limiter.execute(() => callExternalApi());
```

### Error Handling

Global exception filters in `src/exception/`:
- `HttpExceptionFilter` — formats HTTP errors
- `AxiosExceptionFilter` — wraps Axios upstream errors
- `AllExceptionsFilter` — catches unhandled exceptions

Registered globally in `main.ts`.

### Logging

`LoggerService` in `src/logger/` wraps Winston. Inject it directly rather than using `console.log`.

### Code Style

Prettier is configured with: double quotes (`singleQuote: false`), trailing commas (`trailingComma: all`), 120-char line width. ESLint enforces TypeScript rules. Run `yarn lint && yarn format` before committing.

## Module Conventions

### Module responsibility & folder structure

Each module is only responsible for its own code. If resource B belongs to resource A, create module B as a sub-folder inside module A's folder, then import it into the parent module.

```
modules/skill-category/               ← parent module (app.module imports this)
├── skill-category.module.ts
├── skill-category.controller.ts
├── skill-category.service.ts
├── dto/
└── skill/                            ← child module lives inside parent folder
    ├── skill.module.ts
    ├── skill.controller.ts
    ├── skill.service.ts
    ├── dto/
    └── skill-public/                 ← public sub-module inside skill/
        ├── skill-public.module.ts
        └── skill-public.controller.ts
```

### Response key naming

Response keys must always be the **camelCase of the module name** — never generic words like `data`, `item`, `result`, `category`.

```typescript
// module: skill-category
return { skillCategories, total };   // list
return { skillCategory };            // detail

// module: skill
return { skills, total };            // list
return { skill };                    // detail
```

### Public routes

All routes decorated with `@PermitAll()` must be defined in the single top-level `public` module (`src/modules/public/`). Do not scatter public endpoints across individual resource modules.

```
modules/public/
├── public.module.ts     ← imports whichever resource modules it needs
└── public.controller.ts ← all @PermitAll() routes, prefixed with /public
```

`PublicModule` imports the resource modules whose services it needs (e.g. `SkillCategoryModule`). Those modules must export the relevant service. `app.module.ts` imports `PublicModule` alongside the other modules.

Public service methods live on the owning resource's service and are named `publicList()`, `publicDetail()`, etc. (e.g. `SkillCategoryService.publicList()`).
