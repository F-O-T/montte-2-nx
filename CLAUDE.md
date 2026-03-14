# Project

This is a monorepo managed with Nx.

## UI Library

This project uses **Base UI** (not Radix UI).

- Base UI does **not** support `asChild`. Instead, use the `render` prop to customize the rendered element.
- Do not use Radix-style composition patterns (e.g., `<Slot>`, `asChild`).
- When wrapping Base UI components, use `render` to pass custom elements or components.
