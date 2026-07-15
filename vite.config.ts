/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import pkg from "./package.json" with { type: "json" };

// https://vite.dev/config/
export default defineConfig({
	// Single source of truth for the app version (M8, F027): package.json's
	// version is injected at build time and surfaces as APP_VERSION in config.ts.
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	plugins: [react(), tailwindcss()],
	server: {
		host: 'localhost',
		// host: "localhost", // or '0.0.0.0' if you want LAN access
		port: 5174, // port
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"), // now @ points to /src
		},
	},
	base: "/",
	build: {
		rollupOptions: {
			output: {
				// Split rarely-changing vendors into their own cacheable chunks
				// (M8): app-code deploys no longer invalidate the vendor cache,
				// and the browser fetches them in parallel.
				manualChunks: {
					react: ["react", "react-dom", "react-router-dom"],
					redux: ["@reduxjs/toolkit", "react-redux"],
					i18n: ["i18next", "react-i18next", "i18next-browser-languagedetector"],
					baseui: ["@base-ui/react"],
				},
			},
		},
	},
	test: {
		environment: "jsdom",
		include: ["src/__tests__/**/*.test.{ts,tsx}"],
		setupFiles: ["src/__tests__/setup.ts"],
	},
});
