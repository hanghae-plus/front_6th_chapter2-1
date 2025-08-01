import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  base: '/front_6th_chapter2-1/',
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
});
