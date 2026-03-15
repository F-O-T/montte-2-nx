import type { UserConfig } from 'vitest/config';

export const sharedCoverageConfig: NonNullable<UserConfig['test']>['coverage'] =
  {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
  };
