import { configDefaults } from 'vitest/config';

export const unitTestIncludes = ['**/__tests__/**/*.unit.test.ts'];

export const integrationTestIncludes = [
  '**/__tests__/**/*.integration.test.ts',
];

export const sharedTestExclude = [
  ...configDefaults.exclude,
  'dist/**',
  'coverage/**',
  '.nx/**',
  '.tanstack/**',
  'src/routeTree.gen.ts',
];
