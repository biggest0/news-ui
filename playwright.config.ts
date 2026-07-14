import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright e2e configuration (M7 — replaces Cypress).
 *
 * - Runs against the production build served by `vite preview` (port 4173):
 *   no dev-mode StrictMode double-effects, prod-like bundle. `npm run
 *   test:e2e` builds first; CI builds in a prior step.
 * - The backend is fully stubbed per-test via page.route (see e2e/support),
 *   so no API server is needed — locally or in CI.
 * - Chromium-only by owner decision; add projects here to widen coverage.
 */
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
	use: {
		baseURL: "http://localhost:4173",
		trace: "on-first-retry",
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
	],
	webServer: {
		command: "npm run preview",
		url: "http://localhost:4173",
		reuseExistingServer: !process.env.CI,
		timeout: 30_000,
	},
});
