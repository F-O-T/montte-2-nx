# Project

This is a monorepo managed with Nx.

## Repository conventions

- Use Bun from the repository root for workspace commands.
- Prefer existing repository patterns over introducing new abstractions.
- Keep module boundaries clean across `apps/*`, `packages/*`, `core/*`, and `tooling/*`.
- Put runnable applications in `apps/*`.
- Put shared product-facing code in `packages/*`.
- Put platform and infrastructure code in `core/*`.
- Put repo-wide tooling, configuration, and guardrails in `tooling/*`.
- Default to project-level `__tests__` directories for apps/packages/core projects, and keep tests owned by the relevant project instead of placing them under `src` unless that project already has an established `src`-based testing convention.
- Projects with tests should also define a dedicated test tsconfig, preferably `tsconfig.spec.json` (or `tsconfig.test.json` if that project already uses it), including `src`, `__tests__`, and test config files when present.

## Primary stack

- Nx for monorepo orchestration
- Bun for package management and scripts
- React 19 + TanStack Start for the main app
- Vite for app builds and local development
- Base UI for UI primitives
- Tailwind CSS v4 for styling
- oRPC + Zod for type-safe APIs
- Drizzle + PostgreSQL for the data layer
- Storybook for shared UI development
- Oxlint + Oxfmt for linting and formatting

## Common commands

Run these from the repository root:

```bash
bun install
bun run dev
bun run dev:web
bun run dev:storybook
bun run build
bun run check-types
bun run lint
bun run lint:fix
bun run format
bun run check
```

Database workflows:

```bash
bun run db:push
bun run db:generate
bun run db:migrate
bun run db:studio
bun run db:start
bun run db:stop
bun run db:down
```

## Validation and testing expectations

- Run the validation most relevant to the files you changed before claiming work is complete.
- At minimum, prefer running `bun run lint` and `bun run check-types` for code changes.
- For broader or riskier changes, also run `bun run build`.
- If your changes affect routing, auth, database flows, localization, shared UI, or repository tooling, verify those areas directly in development instead of relying only on static checks.
- Respect existing Nx targets and project boundaries rather than inventing one-off local workflows.

## Pre-commit hooks

This repository uses Lefthook.

Current pre-commit jobs run:

- `oxlint` with autofix on staged files

Hooks may modify staged files automatically. Re-check diffs after hooks run.

## UI Library

This project uses **Base UI** (not Radix UI).

- Base UI does **not** support `asChild`. Instead, use the `render` prop to customize the rendered element.
- Do not use Radix-style composition patterns (e.g., `<Slot>`, `asChild`).
- When wrapping Base UI components, use `render` to pass custom elements or components.

## Web app conventions

- The main application lives in `apps/web`.
- Keep route-level concerns close to route files when practical.
- Reuse shared modules from `packages/*` and `core/*` instead of duplicating logic in the app.
- Use Storybook when working on shared UI in `packages/ui`.

## Localization conventions

This repository uses Paraglide for localization in `apps/web`.

- Edit localization inputs in `project.inlang/settings.json` and `messages/*.json`.
- Do not manually edit generated Paraglide output in `apps/web/src/paraglide/*`.
- Use generated message helpers from `@/paraglide/messages` for user-facing copy.
- If locale configuration or route localization changes, verify localized URLs, locale detection, metadata, and `<html lang>` behavior.

## Code Style

- Do not add comments to the code.
- Keep code explicit, maintainable, and aligned with existing repository patterns.
- Prefer path alias imports over relative imports when an alias exists. Use workspace aliases such as `@core/auth/*`, `@packages/ui/*`, and app aliases such as `@/*` instead of long relative paths.
