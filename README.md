# template-nx

`template-nx` is an Nx monorepo template for building modern TypeScript products with a clean separation between apps, shared packages, core platform modules, and repo-level tooling.

It ships with a web app, a Storybook workspace, a shared UI library, a type-safe API layer, database and auth foundations, and operational modules for analytics, logging, Redis, AI workflows, and security.

## What you get

- **Nx** for monorepo orchestration, task pipelines, and caching
- **Bun** as the package manager and script runner
- **React 19 + TanStack Start** for the main app
- **Tailwind CSS v4** for styling
- **Base UI-powered shared components** in `packages/ui`
- **oRPC + Zod** for end-to-end type-safe APIs
- **Drizzle + PostgreSQL** for the data layer
- **better-auth** for authentication
- **Storybook** for component development
- **Oxlint + Oxfmt** for linting and formatting

## Workspace structure

```text
template-nx/
├── apps/
│   ├── web/          # Main product app
│   └── storybook/    # UI development and component showcase
├── packages/
│   ├── ui/           # Shared UI primitives and app-facing components
│   └── api/          # Type-safe API layer built around oRPC
├── core/
│   ├── env/          # Environment validation and config loading
│   ├── auth/         # Authentication services and integration
│   ├── db/           # Database client, schema, and Drizzle workflows
│   ├── logging/      # Logging and OpenTelemetry integration
│   ├── posthog/      # Analytics clients
│   ├── redis/        # Redis connection utilities
│   ├── arcjet/       # Security and request protection helpers
│   └── mastra/       # AI and agent workflow integration
└── tooling/
    ├── css/          # Shared CSS and styling utilities
    ├── oxc/          # Lint and format configuration
    ├── boundary/     # Workspace boundary enforcement
    └── config/       # Shared configuration package
```

## Apps

### `apps/web`

The main application is built with React, Vite, and TanStack Start. It consumes shared UI from `packages/ui`, the API layer from `packages/api`, and platform modules from `core/*`.

### `apps/storybook`

Storybook is included as a dedicated app so you can develop and document the shared UI system in isolation.

## Packages

### `packages/ui`

This is the shared component library for the workspace. It contains reusable UI building blocks, hooks, and utilities that can be consumed by apps across the monorepo.

- Built around **Base UI** primitives
- Styled with **Tailwind CSS**
- Exported through typed workspace entrypoints such as `@packages/ui/components/*`
- Backed by Storybook for faster design system development

### `packages/api`

This package centralizes the application's type-safe API surface.

- Uses **oRPC** and **Zod**
- Connects the app to `core/auth`, `core/db`, `core/env`, and `core/arcjet`
- Keeps backend contracts reusable and composable across the workspace

## Core

The `core` directory contains platform-level modules that hold infrastructure and business-critical foundations.

- **`@core/env`**: validates and exposes environment variables
- **`@core/auth`**: wraps authentication with `better-auth`
- **`@core/db`**: manages Drizzle, PostgreSQL, and local database workflows
- **`@core/logging`**: provides logging and OpenTelemetry support
- **`@core/posthog`**: separates analytics for client and server usage
- **`@core/redis`**: provides Redis access utilities
- **`@core/arcjet`**: holds request protection and security helpers
- **`@core/mastra`**: supports AI and agent-related workflows

This structure makes it easier to keep product code, infrastructure concerns, and shared platform capabilities clearly separated.

## Tooling

The `tooling` layer keeps repo-wide conventions centralized.

- **`@tooling/css`**: shared global styles and styling dependencies
- **`@tooling/oxc`**: linting and formatting scripts powered by Oxlint and Oxfmt
- **`@tooling/boundary`**: workspace boundary checks to keep architecture clean
- **`@tooling/config`**: shared config package consumed across apps and libraries

Together, these packages make the template easier to scale without scattering config across the repository.

## Getting started

Install dependencies:

```bash
bun install
```

If you are using the database features, configure your environment in `apps/web/.env` and then apply the schema:

```bash
bun run db:push
```

Start development:

```bash
bun run dev
```

Start only the web app:

```bash
bun run dev:web
```

Start Storybook:

```bash
bun run dev:storybook
```

## Common commands

```bash
bun run dev
bun run build
bun run check-types
bun run lint
bun run lint:fix
bun run format
bun run check
```

Database commands:

```bash
bun run db:start
bun run db:push
bun run db:generate
bun run db:migrate
bun run db:studio
bun run db:stop
bun run db:down
```

## Conventions

- Use **Bun** from the repo root for workspace commands
- Use **Nx targets** for app and package workflows
- Shared product code belongs in `packages/*`
- Platform and infrastructure code belongs in `core/*`
- Repo-wide config and guardrails belong in `tooling/*`
- This project uses **Base UI**, not Radix UI; use the `render` prop instead of `asChild`

## Why this template

`template-nx` is designed for teams that want more than a starter app. It gives you a structured foundation for shipping production software with clear module boundaries, reusable packages, and tooling that scales with the codebase.
