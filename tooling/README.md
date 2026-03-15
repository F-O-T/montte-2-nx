# Tooling

The `tooling` directory contains repository-wide configuration, guardrails, and shared development utilities for `template-nx`.

## What lives here

- `css/` — shared styling assets and CSS-related dependencies
- `oxc/` — linting and formatting setup
- `boundary/` — architecture boundary checks
- `config/` — shared configuration package used across the workspace

## Why this layer exists

Instead of scattering repo conventions across apps and packages, `tooling` keeps cross-cutting development concerns centralized and reusable.

## Working in this directory

- Put repo-wide configuration and enforcement here
- Avoid mixing app logic or business logic into tooling packages
- Keep commands and conventions usable from the root workspace

See each module README for details.
