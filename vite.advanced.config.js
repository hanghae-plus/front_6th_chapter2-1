import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const base =
  process.env.NODE_ENV === "production" ? "/front_6th_chapter2-1/" : "";

export default defineConfig({
  base,
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.js",
  },
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./index.advanced.html",
      },
    },
  },
});
