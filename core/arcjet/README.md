# @core/arcjet

`@core/arcjet` contains security and request protection helpers.

## Purpose

This module wraps Arcjet integration so API and app layers can reuse a common security foundation.

## Highlights

- Uses `@arcjet/node`
- Depends on `@core/env`
- Intended for reusable protection and security-related integration

## Source layout

- `src/index.ts` — Arcjet entrypoint

## When to use this module

Use this package for request protection, abuse prevention, and reusable security integrations that should be shared across the workspace.
