import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/front_6th_chapter2-1/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: "index.html",
        basic: "index.basic.html",
        advanced: "index.advanced.html",
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.js",
  },
});
