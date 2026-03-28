/**
 * E2E tests for navigation flows.
 *
 * Tests the category bar navigation, footer links, and route transitions.
 * All API calls are stubbed so tests run without a backend.
 *
 * Tests:
 * - Clicking a category navigates to the correct URL
 * - Category link is highlighted (accent color) when active
 * - Footer links navigate to static pages (About, Contact, Disclaimer)
 * - Browser back button works after navigation
 */
describe("Navigation", () => {
	beforeEach(() => {
		cy.stubApi();
		cy.visit("/");
		cy.waitForApp();
	});

	/** Clicking "SCIENCE" in the category bar navigates to /science. */
	it("navigates to a category page via the category bar", () => {
		cy.contains("SCIENCE").click();
		cy.url().should("include", "/science");
	});

	/** The active category link has the accent/underline styling. */
	it("highlights the active category link", () => {
		cy.contains("SCIENCE").click();
		cy.contains("SCIENCE").should("have.class", "text-accent");
	});

	/** Navigating to a category then clicking another changes the URL. */
	it("switches between category pages", () => {
		cy.contains("POLITICS").click();
		cy.url().should("include", "/politics");

		cy.contains("BUSINESS").click();
		cy.url().should("include", "/business");
	});

	/** Footer "Disclaimer" link navigates to /disclaimer. */
	it("navigates to the Disclaimer page from footer", () => {
		cy.get("footer").scrollIntoView();
		cy.get("footer").contains("Disclaimer").click();
		cy.url().should("include", "/disclaimer");
		cy.contains("DISCLAIMER").should("be.visible");
	});

	/** Footer "Contact" link navigates to /contact. */
	it("navigates to the Contact page from footer", () => {
		cy.get("footer").scrollIntoView();
		cy.get("footer").contains("Contact").click();
		cy.url().should("include", "/contact");
		cy.contains("CONTACT").should("be.visible");
	});

	/** Browser back button returns to the previous page. */
	it("supports browser back navigation", () => {
		cy.contains("TECHNOLOGY").click();
		cy.url().should("include", "/technology");

		cy.go("back");
		cy.url().should("eq", Cypress.config().baseUrl + "/");
	});
});
