import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "src/advanced",
  base: "/front_6th_chapter2-1/",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "../setupTests.js",
  },
});
