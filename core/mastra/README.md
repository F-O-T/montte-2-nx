# @core/mastra

`@core/mastra` contains AI and agent workflow integration for the workspace.

## Purpose

This module provides a home for Mastra-based agents, tools, and related orchestration code.

## Highlights

- Uses **Mastra**
- Includes agent and tool examples
- Depends on `@core/env`
- Supports local development with a dedicated `dev` script

## Source layout

- `src/index.ts` — package entrypoint
- `src/mastra/index.ts` — Mastra composition entrypoint
- `src/mastra/agents/` — agent implementations
- `src/mastra/tools/` — tool implementations

## Development

This module includes a local development script powered by environment values from `apps/web/.env`.
