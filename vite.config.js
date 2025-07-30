import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/advanced": path.resolve(__dirname, "./src/advanced"),
      "@/components": path.resolve(__dirname, "./src/advanced/components"),
      "@/store": path.resolve(__dirname, "./src/advanced/store"),
      "@/types": path.resolve(__dirname, "./src/advanced/types"),
      "@/data": path.resolve(__dirname, "./src/advanced/data"),
      "@/utils": path.resolve(__dirname, "./src/advanced/utils"),
      "@/hooks": path.resolve(__dirname, "./src/advanced/hooks"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.js",
  },
});
