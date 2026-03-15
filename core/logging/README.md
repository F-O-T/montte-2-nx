# @core/logging

`@core/logging` provides logging and observability primitives for the workspace.

## Purpose

This module centralizes logging setup and OpenTelemetry integration so services can emit structured logs and observability signals consistently.

## Highlights

- Uses **Pino** for logging
- Includes **OpenTelemetry** dependencies and exports
- Supports reusable logging and telemetry setup across services

## Source layout

- `src/index.ts` — logging entrypoint
- `src/otel.ts` — OpenTelemetry-specific integration

## When to use this module

Use this package for shared logger setup, telemetry wiring, and service-level observability primitives.
