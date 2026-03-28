/**
 * E2E tests for the dark mode / theme toggle.
 *
 * The app uses class-based dark mode: the `html` element gets a `dark`
 * class which triggers CSS variable overrides. The ThemeToggle button
 * in the desktop nav toggles between light and dark modes.
 *
 * Tests:
 * - App starts in light mode by default (no `dark` class on html)
 * - Clicking the theme toggle adds the `dark` class
 * - Clicking again removes the `dark` class (round-trip)
 * - Dark mode preference persists across page reloads
 */
describe("Theme Toggle", () => {
	beforeEach(() => {
		cy.stubApi();
		// Clear any persisted theme preference
		cy.clearLocalStorage();
		cy.visit("/");
		cy.waitForApp();
	});

	/** App defaults to light mode — html element should not have `dark` class. */
	it("starts in light mode by default", () => {
		cy.get("html").should("not.have.class", "dark");
	});

	/** Clicking the theme toggle enables dark mode. */
	it("toggles to dark mode on click", () => {
		cy.get('button[aria-label="Switch to dark mode"]').click();
		cy.get("html").should("have.class", "dark");
	});

	/** Clicking the theme toggle twice returns to light mode. */
	it("toggles back to light mode on second click", () => {
		cy.get('button[aria-label="Switch to dark mode"]').click();
		cy.get("html").should("have.class", "dark");

		cy.get('button[aria-label="Switch to light mode"]').click();
		cy.get("html").should("not.have.class", "dark");
	});

	/** Dark mode setting persists after a page reload. */
	it("persists dark mode across page reload", () => {
		cy.get('button[aria-label="Switch to dark mode"]').click();
		cy.get("html").should("have.class", "dark");

		cy.reload();
		cy.waitForApp();
		cy.get("html").should("have.class", "dark");
	});
});
