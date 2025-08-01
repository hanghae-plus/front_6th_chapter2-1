// import { defineConfig } from 'vitest/config';
// import { resolve } from 'path';

// const base = process.env.NODE_ENV === 'production' ? '/front_6th_chapter2-1/' : '';

// export default defineConfig({
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: 'src/setupTests.js',
//   },
//   base,
//   build: {
//     rollupOptions: {
//       // input: 'index.advanced.html',
//       input: {
//         main: resolve(__dirname, 'index.advanced.html'),
//         404: resolve(__dirname, '404.html'),
//       },
//     },
//   },
// });

import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const base = process.env.NODE_ENV === 'production' ? '/front_6th_chapter2-1/' : '';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  base,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.basic.html'),
      },
    },
  },
});
