/** Ports/IDs shared by playwright.local.config.ts and the e2e-local specs. */
export const LOCAL_E2E = {
  projectId: 'demo-smartfit', // "demo-" = emulator-only, can never reach a real project
  authEmulatorHost: '127.0.0.1:9099',
  firestoreEmulatorHost: '127.0.0.1:8085',
  apiPort: 8090,
  webPort: 5174,
};
