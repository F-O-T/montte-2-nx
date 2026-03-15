import { defineNodeUnitTestConfig } from "../../tooling/config/vitest/node";

export default defineNodeUnitTestConfig({
  overrides: {
    root: import.meta.dirname,
  },
});
