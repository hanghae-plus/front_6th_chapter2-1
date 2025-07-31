import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const base = process.env.NODE_ENV === 'production' ? "/front_6th_chapter2-1/" : '';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts']
  }
});
