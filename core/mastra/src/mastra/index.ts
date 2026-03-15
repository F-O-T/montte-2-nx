import { Mastra } from "@mastra/core";
import { Observability } from "@mastra/observability";
import { PosthogExporter } from "@mastra/posthog";
import { env } from "@core/env";
import { weatherAgent } from "./agents/weather-agent";

export const mastra = new Mastra({
  agents: { weatherAgent },
  observability: new Observability({
    configs: {
      posthog: {
        serviceName: env.OTEL_SERVICE_NAME,
        exporters: [
          new PosthogExporter({
            apiKey: env.POSTHOG_API_KEY,
            host: env.POSTHOG_HOST,
          }),
        ],
      },
    },
  }),
});
