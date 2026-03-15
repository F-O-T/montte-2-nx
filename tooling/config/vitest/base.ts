import { defineConfig, type UserConfig } from "vitest/config";

import { sharedCoverageConfig } from "./coverage";
import { sharedTestExclude } from "./filters";

type BaseTestConfigOptions = {
  include: string[];
  overrides?: UserConfig;
};

export function defineBaseTestConfig(options: BaseTestConfigOptions) {
  const overrideTestConfig = options.overrides?.test ?? {};

  return defineConfig({
    ...options.overrides,
    test: {
      globals: true,
      clearMocks: true,
      restoreMocks: true,
      mockReset: true,
      include: options.include,
      exclude: sharedTestExclude,
      coverage: sharedCoverageConfig,
      ...overrideTestConfig,
    },
  });
}
