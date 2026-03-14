import { Mastra } from "@mastra/core";
import { PosthogExporter } from "@mastra/posthog";
import { env } from "@core/env/server";
import { weatherAgent } from "./agents/weather-agent";

export const mastra = new Mastra({
  agents: { weatherAgent },
  telemetry: {
    serviceName: env.OTEL_SERVICE_NAME,
    enabled: true,
    export: {
      type: "custom",
      exporter: new PosthogExporter({
        apiKey: env.POSTHOG_API_KEY,
        host: env.POSTHOG_HOST,
      }),
    },
  },
});
