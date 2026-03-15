# @tooling/config

`@tooling/config` is the shared configuration package for the workspace.

## Purpose

This module exists as a common dependency for apps, packages, and core modules that need access to shared configuration conventions.

## Why it matters

Using a shared config package makes it easier to standardize tooling and project behavior across the monorepo.

## Notes

This package is intentionally lightweight and is designed to be expanded as configuration needs grow.

## Vitest

Vitest configuration belongs in `@tooling/config`.

Runtime test helpers do not belong here. Shared test infrastructure such as PGlite factories, database reset helpers, or auth test harnesses should live in `@tooling/test`.

### Available exports

- `@tooling/config/vitest/base`
- `@tooling/config/vitest/coverage`
- `@tooling/config/vitest/filters`
- `@tooling/config/vitest/node`

### Package conventions

Packages should keep a local `vitest.config.ts` and import a shared helper from `@tooling/config/vitest/node`.

Supported test file patterns:

- `__tests__/**/*.unit.test.ts`
- `__tests__/**/*.integration.test.ts`
