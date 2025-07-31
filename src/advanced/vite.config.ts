import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/front_6th_chapter2-1/',
  resolve: {
    alias: {
      '*': resolve(__dirname, './src'),
      cart: resolve(__dirname, './src/cart'),
      product: resolve(__dirname, './src/product'),
      order: resolve(__dirname, './src/order'),
      shared: resolve(__dirname, './src/shared'),
      '@shared': resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        404: resolve(__dirname, 'index.html'),
      },
    },
  },
});
