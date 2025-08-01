import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/front_6th_chapter2-1/",
  build: {
    rollupOptions: {
      input: "./index.advanced.html",
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.js",
  },
});
