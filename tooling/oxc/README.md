# @tooling/oxc

`@tooling/oxc` defines linting and formatting tooling for the workspace.

## Purpose

This module centralizes the repository's code quality commands and shared Oxc configuration usage.

## Highlights

- Uses **Oxlint** for linting
- Uses **Oxfmt** for formatting
- Supports lint, lint fix, write-format, and format-check flows

## Available scripts

- `lint`
- `lint:fix`
- `format`
- `format:check`

## Why it matters

Keeping lint and formatting behavior centralized helps packages and core modules stay consistent without each workspace owning its own isolated toolchain.
