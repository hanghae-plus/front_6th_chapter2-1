import { defineConfig } from 'vitest/config';

const base: string = process.env.NODE_ENV === 'production' ? '/front_6th_chapter2-1/' : '';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  base,
  build: {
    rollupOptions: {
      input: 'index.advanced.html',
    },
  },
});
