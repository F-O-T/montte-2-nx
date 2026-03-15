# @core/redis

`@core/redis` provides Redis connectivity for the workspace.

## Purpose

This module centralizes Redis client setup so apps and services can reuse a consistent connection layer.

## Highlights

- Uses **ioredis**
- Depends on `@core/env` for configuration
- Exposes a shared Redis integration surface

## Source layout

- `src/index.ts` — Redis entrypoint

## When to use this module

Put shared Redis connection setup, helpers, and related service integration here.
