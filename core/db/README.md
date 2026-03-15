# @core/db

`@core/db` is the database module for `template-nx`.

## Purpose

This package owns the database connection layer, schema organization, and Drizzle-powered workflows used by the rest of the system.

## Highlights

- Uses **Drizzle ORM** with **PostgreSQL**
- Includes migration and schema files
- Provides scripts for push, generate, migrate, and studio workflows
- Includes local Docker Compose database commands

## Source layout

- `src/index.ts` — main database exports
- `src/schema/` — schema definitions such as auth-related tables
- `src/migrations/` — generated SQL migrations and metadata

## Available workflows

Run from the repository root:

```bash
bun run db:start
bun run db:push
bun run db:generate
bun run db:migrate
bun run db:studio
bun run db:stop
bun run db:down
```

## Notes

Database scripts load environment variables from `apps/web/.env`.
