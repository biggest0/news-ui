import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:5174",
		viewportWidth: 1280,
		viewportHeight: 720,
		defaultCommandTimeout: 8000,
		setupNodeEvents(_on, _config) {
			// implement node event listeners here
		},
	},
});
