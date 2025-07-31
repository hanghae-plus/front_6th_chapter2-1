import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: 'index.advanced.html',
    },
  },
});
