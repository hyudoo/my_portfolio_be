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
