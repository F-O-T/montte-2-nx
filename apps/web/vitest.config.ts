import { defineNodeUnitTestConfig } from '../../tooling/config/vitest/node';

export default defineNodeUnitTestConfig({
  overrides: {
    root: import.meta.dirname,
    resolve: {
      alias: {
        '@web': `${import.meta.dirname}/src`,
      },
    },
  },
});
