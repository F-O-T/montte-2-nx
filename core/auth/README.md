# @core/auth

`@core/auth` contains authentication logic for the workspace.

## Purpose

This module wraps authentication behavior with `better-auth` and integrates it with the shared database and environment layers.

## Highlights

- Built on **better-auth**
- Depends on `@core/db` and `@core/env`
- Designed to be reused by apps and API layers

## Source layout

- `src/index.ts` — package entrypoint and auth exports

## When to use this module

Add code here when it belongs to authentication flows, auth configuration, or reusable auth services.
