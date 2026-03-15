export type NodeTestHooks = {
  beforeEach?: () => Promise<void> | void;
  afterEach?: () => Promise<void> | void;
};

export function createNodeTestHooks(hooks: NodeTestHooks = {}) {
  return hooks;
}
