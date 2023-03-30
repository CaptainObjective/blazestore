import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    // Disabling multi-threading as all tests are using the same database instance
    maxThreads: 1,
    minThreads: 1,
    setupFiles: './src/tests/setup.ts',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      exclude: ['**/tests/**', 'src/**/index.ts'],
    },
  },
});
