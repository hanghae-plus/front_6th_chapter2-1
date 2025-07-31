import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
const base = '/front_6th_chapter2-1/';

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
