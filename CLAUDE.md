# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Turborepo monorepo** (pnpm workspaces) containing a full-stack TypeScript application:

- **`apps/api`** - NestJS backend API (GraphQL, REST, WebSocket)
- **`apps/web`** - Next.js 16 frontend with React 19
- **`packages/database`** - Prisma ORM layer for PostgreSQL
- **`packages/ui`** - Shared React component library (shadcn/ui based)
- **`packages/shared`** - Shared TypeScript types/interfaces
- **`packages/eslint-config`** / **`packages/typescript-config`** - Shared configurations

## Development Commands

```bash
# Install dependencies
pnpm install

# Run all apps in development mode
pnpm dev

# Build all packages and apps
pnpm build

# Run linting across all packages
pnpm lint

# Run type checking
pnpm check-types

# Format code with Prettier
pnpm format

# Database operations (run from packages/database or root)
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Create and apply migrations
pnpm db:deploy      # Deploy migrations to production
```

### App-specific Commands

**API (NestJS):**
```bash
cd apps/api
pnpm test           # Run unit tests
pnpm test:e2e       # Run e2e tests
pnpm test:cov       # Run tests with coverage
```

**Web (Next.js):**
```bash
cd apps/web
pnpm check-types    # Type check after generating Next.js types
```

## Architecture

### Backend (`apps/api`)

NestJS application with modular architecture in `src/shared/`:

- **`core/`** - Core module with interceptors, guards, decorators, pipes, and base classes
- **`database/`** - Database connections (MongoDB, Neo4j, Redis) - PostgreSQL via Prisma
- **`graphql/`** - GraphQL setup with Apollo Server, resolvers, and subscriptions
- **`http/`** - HTTP service for external API calls
- **`i18n/`** - Internationalization module
- **`metrics/`** - Prometheus metrics middleware
- **`socket/`** - WebSocket (Socket.io) gateway setup
- **`transporter/`** - Message queue integrations (Kafka, NATS, RabbitMQ)
- **`decorators/`** - Custom NestJS decorators (roles, permissions, public routes)
- **`guards/`** - Authentication/authorization guards

Entry point: `src/main.ts` calls `sharedSetup(app)` from `src/shared/index.ts`

### Frontend (`apps/web`)

Next.js App Router (React 19) with:
- Redux Toolkit for global state (`lib/store.ts`)
- TanStack Query for server state
- Socket.io client for real-time updates
- Tailwind CSS 4 for styling
- Imports components from `@vibe-stack/ui` workspace package

### Database (`packages/database`)

Prisma ORM with PostgreSQL:
- Schema: `prisma/schema.prisma`
- Generated client exports from `src/index.ts`
- Requires `DATABASE_URL` environment variable

### UI Package (`packages/ui`)

React component library built with:
- Rollup bundler (outputs: CJS + ESM)
- TailwindCSS + shadcn/ui components
- React 18 peer dependency
- Vitest for testing

Run tests: `pnpm test --config ./vitest.config.ts`

## Environment Variables

Key environment variables used:
- `DATABASE_URL` - PostgreSQL connection string (required for Prisma)
- `PORT` - API server port (default: 3000)
- `API_PREFIX` - API route prefix (default: `/api`)

## Key Technical Details

- **Monorepo tooling**: Turborepo handles task dependencies (e.g., `db:generate` before `build`)
- **Package manager**: pnpm with workspaces
- **TypeScript**: Strict mode across all packages
- **Testing**: Jest (API), Vitest (UI package)
- **GraphQL**: Apollo Server + GraphQL subscriptions with Redis pub/sub
- **Real-time**: Socket.io with Redis adapter for horizontal scaling
- **Message queues**: Support for Kafka, NATS, and RabbitMQ transports