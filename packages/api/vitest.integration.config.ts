import { defineNodeIntegrationTestConfig } from '@tooling/config/vitest/node';

export default defineNodeIntegrationTestConfig({
  overrides: {
    root: import.meta.dirname,
  },
});
