import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })] as any,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,svelte.ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      all: true,
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
      exclude: [
        'node_modules/**',
        'src/tests/**',
        'src/app.d.ts',
        '**/*.config.*',
        'build/**',
        '.svelte-kit/**',
        'tests/**',
        'static/**',
        'src/hooks.server.ts',
        '**/*.svelte',
        'src/routes/**',
        'src/lib/components/**',
      ],
    },
  },
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/build/**', '**/coverage/**'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/lib'),
    },
  },
});
