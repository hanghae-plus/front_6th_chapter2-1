import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  base: '/front_6th_chapter2-1/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        advanced: resolve(__dirname, 'index.advanced.html'),
        basic: resolve(__dirname, 'index.basic.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
});
