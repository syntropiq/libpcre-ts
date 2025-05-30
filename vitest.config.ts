import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    timeout: 60000, // 60 second timeout for stress tests
    testTimeout: 60000,
    hookTimeout: 60000,
    teardownTimeout: 60000,
    // Allow tests to run longer for performance benchmarks
    slowTestThreshold: 5000,
    // Enable concurrent testing but limit for stability
    pool: 'threads',
    poolOptions: {
      threads: {
        maxThreads: 4,
        minThreads: 1,
      },
    },
    // Stop on first failure
    bail: 1,
    // Add coverage if desired
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'test/**',
        'dist/**',
        'build/**',
      ],
    },
    // Organize test output
    reporter: ['verbose', 'html'],
  },
});
