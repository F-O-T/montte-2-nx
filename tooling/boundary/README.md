# @tooling/boundary

`@tooling/boundary` is the workspace boundary enforcement module.

## Purpose

It provides the `check-boundaries` executable used to verify architectural rules across the monorepo.

## Why it matters

As the workspace grows, boundaries prevent apps, packages, core modules, and tooling from becoming tightly coupled in the wrong directions.

## Entry point

- `check-boundaries.ts`

## Typical usage

Run from the repository root:

```bash
bun run check-boundaries
```
