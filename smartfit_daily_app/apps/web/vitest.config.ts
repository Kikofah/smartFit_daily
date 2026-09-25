import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts on purpose — that one sets `root: 'client'`
// for the Vite dev/build server, which would make Vitest look for test files
// under client/ by default. Tests currently live next to the pure functions
// in server/domain/.
export default defineConfig({
  test: {
    include: ['server/**/*.test.ts'],
  },
});
