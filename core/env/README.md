# @core/env

`@core/env` manages environment configuration for the workspace.

## Purpose

This module validates and exposes environment variables so the rest of the system can rely on a typed, consistent configuration layer.

## Highlights

- Uses **Zod** and `@t3-oss/env-core`
- Loads environment values with `dotenv`
- Exposes a typed runtime configuration surface

## Source layout

- `src/env.ts` — environment schema and exported configuration

## When to use this module

Use `@core/env` whenever code needs validated environment values instead of reading raw process variables directly.
