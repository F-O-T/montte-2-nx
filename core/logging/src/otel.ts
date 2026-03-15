import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  type LogRecordProcessor,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { ORPCInstrumentation } from "@orpc/otel";
import { env } from "@core/env";

const resource = new Resource({
  [ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME,
});

function createLogRecordProcessors() {
  const processors: LogRecordProcessor[] = [
    new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
  ];

  const exporter = new OTLPLogExporter({
    url: `${env.POSTHOG_HOST}/v1/logs`,
    headers: {
      Authorization: `Bearer ${env.POSTHOG_API_KEY}`,
    },
  });

  processors.push(new BatchLogRecordProcessor(exporter));

  return processors;
}

const logRecordProcessors = createLogRecordProcessors();

const sdk = new NodeSDK({
  resource,
  logRecordProcessors,
  instrumentations: [new ORPCInstrumentation()],
});

export function startOtel() {
  sdk.start();
}

export function shutdownOtel() {
  return sdk.shutdown();
}

export { logRecordProcessors, sdk };
