import pino from "pino";
import { env } from "@core/env/server";

const transport =
  env.POSTHOG_API_KEY && env.POSTHOG_HOST
    ? pino.transport({
        targets: [
          {
            target: "pino-opentelemetry-transport",
            options: {
              resourceAttributes: {
                "service.name": env.OTEL_SERVICE_NAME,
              },
            },
          },
          {
            target: "pino/file",
            options: { destination: 1 },
          },
        ],
      })
    : undefined;

export const logger = pino(
  {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
  transport,
);

export type { Logger } from "pino";
export { logger as default };
