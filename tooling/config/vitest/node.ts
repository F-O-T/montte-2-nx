import type { UserConfig } from "vitest/config";

import { defineBaseTestConfig } from "./base";
import { integrationTestIncludes, unitTestIncludes } from "./filters";

type NodeTestConfigOptions = {
  overrides?: UserConfig;
};

export function defineNodeUnitTestConfig(options: NodeTestConfigOptions = {}) {
  const test = {
    environment: "node",
    ...options.overrides?.test,
  };

  return defineBaseTestConfig({
    include: unitTestIncludes,
    overrides: {
      ...options.overrides,
      test,
    },
  });
}

export function defineNodeIntegrationTestConfig(options: NodeTestConfigOptions = {}) {
  const test = {
    environment: "node",
    passWithNoTests: true,
    ...options.overrides?.test,
  };

  return defineBaseTestConfig({
    include: integrationTestIncludes,
    overrides: {
      ...options.overrides,
      test,
    },
  });
}
