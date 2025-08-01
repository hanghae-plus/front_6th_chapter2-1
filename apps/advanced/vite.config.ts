import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const base: string = process.env.NODE_ENV === "production" ? "/front_6th_chapter2-1/" : "";

export default defineConfig({
	base,
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "setupTests.js"
	}
});
