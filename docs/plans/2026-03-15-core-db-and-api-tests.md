# Core DB and API Tests Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add meaningful tests for `@core/db` schema behavior and `@packages/api` context/router behavior on top of the Vitest foundation.

**Architecture:** Keep shared test infra generic in `@tooling/test`, and keep package-specific validation inside each package. `@core/db` integration tests will apply the package migration SQL into an in-memory PGlite database and exercise real Drizzle schema behavior. `@packages/api` tests will stay focused on the package surface by mocking `@core/auth` and `@core/arcjet` while invoking procedures through oRPC `call()`.

**Tech Stack:** Vitest, Nx, PGlite, Drizzle ORM, oRPC

---

### Task 1: Add failing `@core/db` schema integration tests

**Files:**

- Create: `core/db/__tests__/schema.integration.test.ts`

**Step 1: Write the failing test**

Add tests that expect to:

- create a typed test database with `createTestDatabase({ schema })`
- apply `core/db/src/migrations/0000_square_the_twelve.sql`
- insert and read a `user`
- reject duplicate `user.email`
- cascade-delete `session` rows when the owning `user` is deleted

**Step 2: Run test to verify it fails**

Run: `bun run nx run @core/db:test:integration --runInBand`

Expected: TypeScript/runtime failure because the current shared test DB helper does not support typed schema injection.

**Step 3: Write minimal implementation**

Update `@tooling/test/db` to accept an optional generic `schema` option and return a typed Drizzle client without importing `@core/db`.

**Step 4: Run test to verify it passes**

Run: `bun run nx run @core/db:test:integration --runInBand`

Expected: the new schema tests pass.

---

### Task 2: Add failing `@packages/api` context unit tests

**Files:**

- Create: `packages/api/__tests__/context.unit.test.ts`

**Step 1: Write the failing test**

Add tests that expect `createContext` to:

- call `auth.api.getSession` with the incoming request headers
- return the original request and received session

**Step 2: Run test to verify it fails**

Run: `bun run nx run @packages/api:test:unit --runInBand`

Expected: test fails before the auth mock wiring is correct.

**Step 3: Write minimal implementation**

Only adjust test wiring if needed. Avoid changing production behavior unless the test exposes a real issue.

**Step 4: Run test to verify it passes**

Run: `bun run nx run @packages/api:test:unit --runInBand`

Expected: context tests pass.

---

### Task 3: Add failing `@packages/api` router integration tests

**Files:**

- Create: `packages/api/__tests__/routers.integration.test.ts`

**Step 1: Write the failing test**

Add oRPC `call()` tests that expect:

- `healthCheck` returns `"OK"` when rate limiting allows the request
- `privateData` throws `UNAUTHORIZED` when there is no authenticated user
- `privateData` returns the current user when authenticated
- `healthCheck` throws `TOO_MANY_REQUESTS` when rate limiting denies the request

**Step 2: Run test to verify it fails**

Run: `bun run nx run @packages/api:test:integration --runInBand`

Expected: test fails before the arcjet mock wiring is correct.

**Step 3: Write minimal implementation**

Only add or adjust test wiring as needed. Keep production code unchanged unless a real issue is exposed.

**Step 4: Run test to verify it passes**

Run: `bun run nx run @packages/api:test:integration --runInBand`

Expected: router tests pass.

---

### Task 4: Verification

**Files:**

- Modify only files touched by previous tasks

**Step 1: Run targeted tests**

Run:

- `bun run nx run @core/db:test:integration --runInBand`
- `bun run nx run @packages/api:test:unit --runInBand`
- `bun run nx run @packages/api:test:integration --runInBand`

**Step 2: Run type checks**

Run:

- `bun run nx run-many -t check-types --projects=@tooling/test,@core/db,@packages/api`

**Step 3: Review final diff**

Ensure `@tooling/test` stays generic and package-specific assertions stay inside `@core/db` and `@packages/api`.
