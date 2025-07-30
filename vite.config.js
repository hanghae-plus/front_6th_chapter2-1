import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  build: {
    rollupOptions: {
      input: {
        basic: path.resolve('index.basic.html'),
        advanced: path.resolve('index.advanced.html'),
      },
    },
  },
});
