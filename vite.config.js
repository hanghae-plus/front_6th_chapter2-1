import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/front_6th_chapter2-1/',
  build: {
    rollupOptions: {
      input: 'index.advanced.html',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  plugins: [react()],
});
