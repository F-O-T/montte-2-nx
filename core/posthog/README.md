# @core/posthog

`@core/posthog` contains analytics clients for PostHog.

## Purpose

This module separates client-side and server-side PostHog integrations so analytics code can be shared without mixing runtime concerns.

## Highlights

- Exposes `./client` and `./server` entrypoints
- Uses `posthog-js` and `posthog-node`
- Depends on `@core/env` for configuration

## Source layout

- `src/client.ts` — browser/client analytics integration
- `src/server.ts` — server analytics integration

## When to use this module

Use this package for reusable analytics setup rather than configuring PostHog separately in each app or service.
