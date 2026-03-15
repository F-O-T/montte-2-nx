# @packages/ui

`@packages/ui` is the shared component library for `template-nx`.

## Purpose

This package provides reusable UI primitives, composed components, hooks, and frontend utilities that can be consumed by apps across the monorepo.

## Highlights

- Built with **React** and **TypeScript**
- Uses **Base UI** primitives
- Styled with **Tailwind CSS**
- Exposes typed entrypoints for components, hooks, and utilities
- Backed by Storybook for isolated development

## Exports

- `@packages/ui/components/*`
- `@packages/ui/hooks/*`
- `@packages/ui/lib/*`
- `@packages/ui/postcss.config`

## Source layout

- `src/components/` — shared UI components such as buttons, dialogs, tables, comboboxes, drawers, and form controls
- `src/hooks/` — reusable hooks such as `use-mobile`
- `src/lib/` — shared helpers such as `utils.ts`

## Conventions

- Use **Base UI**, not Radix UI composition patterns
- Do not use `asChild`
- When wrapping Base UI components, use the `render` prop
- Keep components reusable and app-agnostic

## Commands

Run from the repository root:

```bash
bun run build
bun run check-types
bun run lint
bun run format
```

Or target this package directly with Nx if needed.
