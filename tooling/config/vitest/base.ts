import { defineConfig, type UserConfig } from 'vitest/config';

import { sharedCoverageConfig } from '@tooling/config/vitest/coverage';
import { sharedTestExclude } from '@tooling/config/vitest/filters';

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
