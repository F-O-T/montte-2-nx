# @packages/api

`@packages/api` contains the shared API layer for `template-nx`.

## Purpose

This package centralizes the application's type-safe API contracts and server-facing composition so apps can consume a consistent interface.

## Highlights

- Built on **oRPC** and **Zod**
- Connects to `@core/auth`, `@core/db`, `@core/env`, and `@core/arcjet`
- Keeps API logic reusable and isolated from app UI code

## Source layout

- `src/index.ts` — package entrypoint
- `src/context.ts` — request and execution context
- `src/routers/` — API router composition

## When to use this package

Add code here when it defines shared API contracts, procedures, router composition, or request context that should not live directly inside an app.

## Commands

Run from the repository root:

```bash
bun run build
bun run check-types
bun run lint
bun run format
```
