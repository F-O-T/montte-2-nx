# Packages

The `packages` directory contains reusable application-facing libraries shared across apps in `template-nx`.

## What lives here

- `ui/` — the shared component system and frontend utilities
- `api/` — the type-safe API layer used by the app

## Why this layer exists

Packages hold code that is meant to be imported by apps and reused across product surfaces. In this template, that means UI primitives, shared frontend building blocks, and API contracts that should not be tightly coupled to a single app.

## Current packages

### `@packages/ui`

The shared UI library. It exposes components, hooks, and utilities through typed workspace exports.

### `@packages/api`

The shared API package. It centralizes the oRPC-based server surface and related contracts.

## Working in this directory

- Put reusable app-facing libraries here
- Prefer `core/*` for infrastructure and platform concerns
- Keep package exports intentional and typed
- Use Nx and Bun from the repository root for builds, type checks, and linting

See each package README for module-specific details.
