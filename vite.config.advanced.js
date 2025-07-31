import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

const base = process.env.NODE_ENV === 'production' ? '/front_6th_chapter2-1/' : '';

export default defineConfig({
  plugins: [react()],
  base,
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.advanced.html'),
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/advanced': path.resolve(__dirname, './src/advanced'),
      '@/components': path.resolve(__dirname, './src/advanced/components'),
      '@/store': path.resolve(__dirname, './src/advanced/store'),
      '@/types': path.resolve(__dirname, './src/advanced/types'),
      '@/data': path.resolve(__dirname, './src/advanced/data'),
      '@/utils': path.resolve(__dirname, './src/advanced/utils'),
      '@/hooks': path.resolve(__dirname, './src/advanced/hooks'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
});
