import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vitest/config';

const base = process.env.NODE_ENV === 'production' ? '/front_6th_chapter2-1/' : '';
const entryFileName = 'index.advanced.html';

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, entryFileName),
    },
  },
  plugins: [
    react(),
    {
      name: 'rename-html-output',
      closeBundle() {
        const from = path.resolve(__dirname, `dist/${entryFileName}`);
        const to = path.resolve(__dirname, 'dist/index.html');
        if (fs.existsSync(from)) fs.renameSync(from, to);
      },
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  resolve: {
    alias: {
      '@basic': path.resolve(__dirname, './src/basic'),
      '@advanced': path.resolve(__dirname, './src/advanced'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});
