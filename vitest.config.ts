import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Disabling multi-threading as all tests are using the same database instance
    maxThreads: 1,
    minThreads: 1,
    setupFiles: './src/tests/setup.ts',
    coverage: {
      reporter: 'html-spa',
      all: true,
      src: ['./src'],
      exclude: ['**/tests/**', '**/*.d.ts'],
    },
  },
});
