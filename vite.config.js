import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const getRelativePath = (relativePath) => {
  const root = path.resolve(path.dirname(''));
  return path.join(root, relativePath);
};

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: getRelativePath('src/setupTests.js'),
  },
  plugins: [react()],
  // root: getRelativePath('/src/advanced'),
  base: '/front_6th_chapter2-1/',
  build: {
    outDir: getRelativePath('/dist'),
  },
});
