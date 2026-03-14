import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { ORPCInstrumentation } from "@orpc/otel";
import { env } from "@core/env/server";

const resource = new Resource({
  [ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME,
});

function createLoggerProvider() {
  const provider = new LoggerProvider({ resource });

  if (env.POSTHOG_API_KEY && env.POSTHOG_HOST) {
    const exporter = new OTLPLogExporter({
      url: `${env.POSTHOG_HOST}/v1/logs`,
      headers: {
        Authorization: `Bearer ${env.POSTHOG_API_KEY}`,
      },
    });

    provider.addLogRecordProcessor(new BatchLogRecordProcessor(exporter));
  }

  return provider;
}

const loggerProvider = createLoggerProvider();

const sdk = new NodeSDK({
  resource,
  logRecordProcessors: loggerProvider.activeProcessor
    ? [loggerProvider.activeProcessor]
    : [],
  instrumentations: [new ORPCInstrumentation()],
});

export function startOtel() {
  sdk.start();
}

export function shutdownOtel() {
  return sdk.shutdown();
}

export { loggerProvider, sdk };
