# Core

The `core` directory contains platform and infrastructure modules for `template-nx`.

## What lives here

- `env/` — environment loading and validation
- `auth/` — authentication services
- `db/` — database access, schema, and migration flows
- `logging/` — logging and observability
- `posthog/` — analytics clients
- `redis/` — Redis connectivity
- `arcjet/` — request protection and security helpers
- `mastra/` — AI and agent workflow integration

## Why this layer exists

`core` is where platform concerns live. These modules support apps and packages, but they are not app UI and they are not generic repo tooling. They represent the operational and architectural foundation of the product.

## Working in this directory

- Put infrastructure, platform services, and cross-cutting backend capabilities here
- Keep app-facing composition in `packages/*`
- Keep repo configuration in `tooling/*`

See each module README for details.
