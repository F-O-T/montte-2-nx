# @tooling/css

`@tooling/css` contains shared styling assets for the workspace.

## Purpose

This module provides shared CSS entrypoints and styling dependencies that can be reused across apps and packages.

## Highlights

- Exports `./globals.css`
- Includes Tailwind CSS-related dependencies
- Centralizes common styling foundations for the template

## Source layout

- `src/styles/globals.css` — shared global stylesheet

## When to use this module

Use this package when you want styling primitives or global CSS that should be shared at the workspace level instead of duplicated inside a single app.
