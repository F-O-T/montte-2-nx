# Vitest Testing Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a shared Vitest testing foundation for the Nx monorepo with package-level configs, a new `@tooling/test` runtime helper package, and explicit `test:unit` / `test:integration` targets for `@core/db`, `@core/auth`, and `@packages/api`.

**Architecture:** Keep testing concerns split by responsibility. `@tooling/config` owns shared Vitest configuration factories and defaults. `@tooling/test` owns reusable runtime test infrastructure, including the future shared PGlite + Drizzle harness used by both `@core/db` and `@packages/api`. Each package keeps a tiny local `vitest.config.ts` and `tsconfig.spec.json` so test behavior stays explicit and easy to override.

**Tech Stack:** Nx, Vitest, Vite, TypeScript project references, Drizzle ORM, PGlite, Better Auth test-utils, oRPC testing/mocking

---

## Decisions Locked In

- Shared Vitest config lives in `@tooling/config`
- Shared runtime test helpers live in `@tooling/test`
- Tests live in `<package>/__tests__`
- Test naming convention:
  - `*.unit.test.ts`
  - `*.integration.test.ts`
- Each package owns its own `vitest.config.ts`
- Each package owns its own `tsconfig.spec.json`
- Nx exposes:
  - `test:unit`
  - `test:integration`
- There is no default `test` target

## Important Constraints

- Keep `@tooling/config` config-only
- Keep PGlite out of the shared config layer
- Put shared PGlite helpers in `@tooling/test`
- Start with Node-only presets for the first phase
- Do not add browser/jsdom testing in this pass
- Do not wire Better Auth test-utils or oRPC mocks into the base config layer

## Proposed File Layout

### Create

- `tooling/test/package.json`
- `tooling/test/project.json`
- `tooling/test/tsconfig.json`
- `tooling/test/src/index.ts`
- `tooling/test/src/vitest/index.ts`
- `tooling/test/src/db/index.ts`
- `tooling/config/vitest/base.ts`
- `tooling/config/vitest/node.ts`
- `tooling/config/vitest/filters.ts`
- `tooling/config/vitest/coverage.ts`
- `core/db/vitest.config.ts`
- `core/db/tsconfig.spec.json`
- `core/db/__tests__/smoke.unit.test.ts`
- `core/auth/vitest.config.ts`
- `core/auth/tsconfig.spec.json`
- `core/auth/__tests__/smoke.unit.test.ts`
- `packages/api/vitest.config.ts`
- `packages/api/tsconfig.spec.json`
- `packages/api/__tests__/smoke.unit.test.ts`

### Modify

- `package.json`
- `nx.json`
- `tooling/config/package.json`
- `tooling/config/README.md`
- `core/db/package.json`
- `core/db/project.json`
- `core/auth/package.json`
- `core/auth/project.json`
- `packages/api/package.json`
- `packages/api/project.json`

---

### Task 1: Add workspace testing dependencies

**Files:**

- Modify: `package.json`

**Step 1: Add the failing verification command**

Plan to run:

```bash
bun run nx run @core/db:test:unit
```

Expected before implementation: Nx reports missing target or missing Vitest config.

**Step 2: Add minimal dependencies**

Add root dev dependencies for the shared foundation:

- `vitest`
- `@nx/vitest`
- `@vitest/coverage-v8`

Do not add `@vitest/ui` unless you know you want it.

Delay `pglite`-specific packages until `@tooling/test` runtime helpers are introduced.

**Step 3: Add install command to verify lockfile updates**

Run:

```bash
bun install
```

Expected: install succeeds and lockfile updates cleanly.

**Step 4: Verify package graph still loads**

Run:

```bash
bun run nx graph --file=tmp/graph.html
```

Expected: Nx graph generation succeeds.

**Step 5: Commit**

```bash
git add package.json bun.lockb
git commit -m "build: add shared vitest workspace dependencies"
```

---

### Task 2: Register Nx for Vitest targets

**Files:**

- Modify: `nx.json`

**Step 1: Write the failing verification**

Run:

```bash
bun run nx show project @core/db
```

Expected before implementation: no `test:unit` or `test:integration` targets appear.

**Step 2: Add Nx Vitest plugin support**

Update `nx.json` plugins to include `@nx/vitest` with explicit target names:

- `testTargetName: "test:unit"`

Do not try to make Nx auto-manage integration tests. Keep integration explicit in `project.json` per package.

Also add target defaults for:

- `test:unit`
- `test:integration`

Recommended defaults:

- cache enabled for `test:unit`
- cache disabled for `test:integration` initially

**Step 3: Verify config is valid**

Run:

```bash
bun run nx show project @core/db
```

Expected: Nx still parses workspace config successfully.

**Step 4: Commit**

```bash
git add nx.json
git commit -m "build: register nx vitest target conventions"
```

---

### Task 3: Build shared Vitest config in `@tooling/config`

**Files:**

- Modify: `tooling/config/package.json`
- Modify: `tooling/config/README.md`
- Create: `tooling/config/vitest/base.ts`
- Create: `tooling/config/vitest/node.ts`
- Create: `tooling/config/vitest/filters.ts`
- Create: `tooling/config/vitest/coverage.ts`

**Step 1: Write the first failing smoke consumer**

Create a temporary import in one package config during implementation planning if needed:

```ts
import { defineNodeUnitTestConfig } from '@tooling/config/vitest/node';
```

Expected before implementation: module cannot be resolved.

**Step 2: Export shared config helpers**

Implement a small API surface only:

- `sharedCoverageConfig`
- `sharedTestExclude`
- `unitTestIncludes`
- `integrationTestIncludes`
- `defineNodeUnitTestConfig(options)`
- `defineNodeIntegrationTestConfig(options)`

Use Vitest `defineConfig` / `mergeConfig` patterns, but keep the abstraction minimal.

Recommended defaults:

- `environment: "node"`
- `globals: true`
- `clearMocks: true`
- `restoreMocks: true`
- `mockReset: true`
- include patterns pointing at `__tests__/**/*.unit.test.ts` or `__tests__/**/*.integration.test.ts`
- exclude `dist`, `node_modules`, coverage output, generated files
- use `v8` coverage provider

Keep setup files optional for now. Do not add empty setup files unless they solve a real problem.

**Step 3: Update `@tooling/config` package exports**

Expose the new modules from `tooling/config/package.json` so packages can import them via package paths.

**Step 4: Document the contract**

Extend `tooling/config/README.md` with:

- what belongs in config vs `@tooling/test`
- how a package should consume the shared config
- which file patterns are recognized

**Step 5: Verify the shared config type-checks indirectly**

Run:

```bash
bun run nx run @core/db:check-types
```

Expected during this task: may still fail until package configs exist, but shared config file shape should be valid TypeScript.

**Step 6: Commit**

```bash
git add tooling/config/package.json tooling/config/README.md tooling/config/vitest
git commit -m "build: add shared vitest config helpers"
```

---

### Task 4: Create the `@tooling/test` package skeleton

**Files:**

- Create: `tooling/test/package.json`
- Create: `tooling/test/project.json`
- Create: `tooling/test/tsconfig.json`
- Create: `tooling/test/src/index.ts`
- Create: `tooling/test/src/vitest/index.ts`
- Create: `tooling/test/src/db/index.ts`

**Step 1: Write the failing import**

Planned future consumer import:

```ts
import { createTestDatabase } from '@tooling/test/db';
```

Expected before implementation: module not found.

**Step 2: Create the package shell only**

Add a minimal workspace package with exports for:

- `.`
- `./vitest`
- `./db`

Keep the implementation tiny in this pass. It is acceptable for `src/db/index.ts` to export placeholder types or `TODO`-free no-op factory signatures until the PGlite task begins.

Recommended initial exports:

- `createNodeTestHooks()` or similar tiny helper if actually useful
- `TestDatabaseFactory` type
- `TestDatabaseHandle` type

Do not implement PGlite behavior yet in this task. The purpose here is package shape and import paths.

**Step 3: Wire TypeScript references**

Make sure the new package extends `@tooling/config/tsconfig.base.json` and is buildable by the workspace.

**Step 4: Verify Nx sees the package**

Run:

```bash
bun run nx show project @tooling/test
```

Expected: Nx recognizes the new tooling project.

**Step 5: Commit**

```bash
git add tooling/test
git commit -m "build: add shared testing utilities package"
```

---

### Task 5: Add package-level Vitest configs for `@core/db`

**Files:**

- Modify: `core/db/package.json`
- Modify: `core/db/project.json`
- Create: `core/db/vitest.config.ts`
- Create: `core/db/tsconfig.spec.json`
- Create: `core/db/__tests__/smoke.unit.test.ts`

**Step 1: Write the failing smoke test**

Create:

```ts
import { describe, expect, it } from 'vitest';

describe('core/db test wiring', () => {
  it('runs unit tests', () => {
    expect(true).toBe(true);
  });
});
```

**Step 2: Add the local config and spec tsconfig**

`core/db/vitest.config.ts` should import the shared helper from `@tooling/config/vitest/node`.

`core/db/tsconfig.spec.json` should:

- extend `./tsconfig.json`
- include `__tests__`, `vitest.config.ts`, and any shared type declarations needed
- add Vitest types without polluting the build tsconfig

**Step 3: Add explicit project targets**

In `core/db/project.json`, add:

- `test:unit`
- `test:integration`

Use `@nx/vitest:test` with explicit config paths.

For now, integration can point to the same `vitest.config.ts` plus a mode/env override if needed, or use a second config file if that turns out simpler. Prefer a single config file that reacts to mode or environment only if it stays obvious.

Recommended simpler option: create one config file per target if the shared helper API becomes awkward.

**Step 4: Add package scripts if useful**

In `core/db/package.json`, optionally add:

- `test:unit`
- `test:integration`

Only do this if you want direct package execution outside Nx.

**Step 5: Run the test**

Run:

```bash
bun run nx run @core/db:test:unit
```

Expected: smoke test passes.

**Step 6: Commit**

```bash
git add core/db/package.json core/db/project.json core/db/vitest.config.ts core/db/tsconfig.spec.json core/db/__tests__
git commit -m "test(core/db): add vitest unit test wiring"
```

---

### Task 6: Add package-level Vitest configs for `@core/auth`

**Files:**

- Modify: `core/auth/package.json`
- Modify: `core/auth/project.json`
- Create: `core/auth/vitest.config.ts`
- Create: `core/auth/tsconfig.spec.json`
- Create: `core/auth/__tests__/smoke.unit.test.ts`

**Step 1: Write the failing smoke test**

Use the same minimal smoke structure as `@core/db`.

**Step 2: Add local config and spec tsconfig**

Mirror the `@core/db` approach.

**Step 3: Add explicit Nx targets**

Add `test:unit` and `test:integration` to `core/auth/project.json`.

Keep integration target present even if no integration tests exist yet.

**Step 4: Run the unit test**

Run:

```bash
bun run nx run @core/auth:test:unit
```

Expected: smoke test passes.

**Step 5: Commit**

```bash
git add core/auth/package.json core/auth/project.json core/auth/vitest.config.ts core/auth/tsconfig.spec.json core/auth/__tests__
git commit -m "test(core/auth): add vitest unit test wiring"
```

---

### Task 7: Add package-level Vitest configs for `@packages/api`

**Files:**

- Modify: `packages/api/package.json`
- Modify: `packages/api/project.json`
- Create: `packages/api/vitest.config.ts`
- Create: `packages/api/tsconfig.spec.json`
- Create: `packages/api/__tests__/smoke.unit.test.ts`

**Step 1: Write the failing smoke test**

Use the same minimal smoke structure.

**Step 2: Add local config and spec tsconfig**

Mirror the same shared config consumption pattern.

**Step 3: Add explicit Nx targets**

Add:

- `test:unit`
- `test:integration`

The integration target exists now so the later repo + auth + oRPC work has a stable entry point.

**Step 4: Run the unit test**

Run:

```bash
bun run nx run @packages/api:test:unit
```

Expected: smoke test passes.

**Step 5: Commit**

```bash
git add packages/api/package.json packages/api/project.json packages/api/vitest.config.ts packages/api/tsconfig.spec.json packages/api/__tests__
git commit -m "test(api): add vitest unit test wiring"
```

---

### Task 8: Add workspace-level verification pass

**Files:**

- No new files required

**Step 1: Run unit tests for all three packages**

Run:

```bash
bun run nx run-many -t test:unit --projects=@core/db,@core/auth,@packages/api
```

Expected: all smoke tests pass.

**Step 2: Run integration targets to confirm empty-state behavior**

Run:

```bash
bun run nx run-many -t test:integration --projects=@core/db,@core/auth,@packages/api
```

Expected: either clean pass with zero matched tests or explicit non-failing empty suites, depending on chosen Vitest flags.

If Vitest fails on no tests found, configure integration targets with an allowed empty-state behavior until real integration tests land.

**Step 3: Run type-checks**

Run:

```bash
bun run nx run-many -t check-types --projects=@tooling/test,@core/db,@core/auth,@packages/api
```

Expected: all pass.

**Step 4: Final commit for the foundation**

```bash
git add .
git commit -m "build: establish shared vitest testing foundation"
```

---

## Follow-Up Plan After This Foundation

These are not part of the first implementation pass, but they are the immediate next layer.

### Follow-Up A: Implement shared PGlite test database in `@tooling/test`

**Files to create/modify later:**

- `tooling/test/src/db/pglite.ts`
- `tooling/test/src/db/drizzle.ts`
- `tooling/test/src/db/reset.ts`
- `tooling/test/src/db/index.ts`
- `core/db/__tests__/...*.integration.test.ts`
- `packages/api/__tests__/...*.integration.test.ts`

**Target behavior:**

- single shared factory for in-memory PGlite
- Drizzle schema wiring from `@core/db/schema`
- reset helper between tests
- reusable handle returned to repository and API tests

### Follow-Up B: Add Better Auth test-utils for API integration tests

**Files to create/modify later:**

- `core/auth/src/...` or test-only auth factory module
- `packages/api/__tests__/helpers/auth.ts`
- `packages/api/__tests__/...*.integration.test.ts`

**Target behavior:**

- use Better Auth test-utils in test-only configuration
- expose authenticated headers/session helpers for API tests
- avoid polluting production auth configuration if test plugin is not safe to ship globally

### Follow-Up C: Add oRPC procedure testing patterns

**Files to create/modify later:**

- `packages/api/__tests__/helpers/orpc.ts`
- `packages/api/__tests__/routers/*.integration.test.ts`

**Target behavior:**

- direct server-side `call(...)` tests for procedures
- targeted `implement(...)` mocks where isolation is needed
- repository-backed integration tests using the shared PGlite harness

---

## Notes for the Implementer

- Prefer one obvious abstraction over a “smart” config system
- Keep the first pass boring and verifiable
- Add only the shared config API that is immediately consumed
- Do not add comments to code
- Do not build browser testing abstractions yet
- Do not make `@tooling/test` depend on production app code more than necessary
- Favor explicit config files over environment magic

## Verification Checklist

- `bun install`
- `bun run nx show project @tooling/test`
- `bun run nx run @core/db:test:unit`
- `bun run nx run @core/auth:test:unit`
- `bun run nx run @packages/api:test:unit`
- `bun run nx run-many -t test:integration --projects=@core/db,@core/auth,@packages/api`
- `bun run nx run-many -t check-types --projects=@tooling/test,@core/db,@core/auth,@packages/api`

Plan complete and saved to `docs/plans/2026-03-15-vitest-testing-foundation.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
