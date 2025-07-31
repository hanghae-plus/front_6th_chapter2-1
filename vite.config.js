import path from 'path';
import { defineConfig } from 'vitest/config';

const base = process.env.NODE_ENV === 'production' ? '/front_6th_chapter2-1/' : '';

export default defineConfig({
  base,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  build: {
    rollupOptions: {
      input: {
        basic: path.resolve(__dirname, 'index.basic.html'),
        advanced: path.resolve(__dirname, 'index.advanced.html'),
      },
    },
  },
});
