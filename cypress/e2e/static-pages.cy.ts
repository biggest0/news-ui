/**
 * E2E tests for static pages (About, Contact, Disclaimer).
 *
 * These pages render translated content without API dependencies
 * beyond the initial article loads. Tests verify that each page
 * renders its expected content and headings.
 *
 * Tests:
 * - About page: title, mission section, disclaimer link
 * - Contact page: title, email address, social links
 * - Disclaimer page: title, disclaimer content paragraphs
 * - 404 page: displays "Page not Found" for unknown routes
 */
describe("Static Pages", () => {
	beforeEach(() => {
		cy.stubApi();
	});

	describe("About Page", () => {
		beforeEach(() => {
			cy.visit("/about");
		});

		/** About page renders the ABOUT heading. */
		it("displays the About page title", () => {
			cy.contains("ABOUT").should("be.visible");
		});

		/** About page contains the brand name and mission content. */
		it("shows brand description and mission section", () => {
			cy.contains("Catire Time").should("exist");
			cy.contains("Our Mission").should("exist");
		});

		/** About page has a link to the full disclaimer. */
		it("links to the disclaimer page", () => {
			cy.contains("Full Disclaimer").click();
			cy.url().should("include", "/disclaimer");
		});
	});

	describe("Contact Page", () => {
		beforeEach(() => {
			cy.visit("/contact");
		});

		/** Contact page renders the CONTACT heading. */
		it("displays the Contact page title", () => {
			cy.contains("CONTACT").should("be.visible");
		});

		/** Contact page shows the email address. */
		it("shows the contact email", () => {
			cy.contains("catirecontact@gmail.com").should("be.visible");
		});

		/** Contact page shows social media handles. */
		it("shows social media links", () => {
			cy.contains("Instagram: catiretime").should("exist");
			cy.contains("YouTube: catiretime").should("exist");
		});
	});

	describe("Disclaimer Page", () => {
		beforeEach(() => {
			cy.visit("/disclaimer");
		});

		/** Disclaimer page renders the heading. */
		it("displays the Disclaimer page title", () => {
			cy.contains("DISCLAIMER").should("be.visible");
		});

		/** Disclaimer page contains key disclaimer text. */
		it("shows disclaimer content", () => {
			cy.contains("entertainment purposes only").should("exist");
			cy.contains("satirical works").should("exist");
		});
	});

	describe("404 Page", () => {
		/** Unknown routes display the 404 message. */
		it("shows Page not Found for unknown routes", () => {
			cy.visit("/this-does-not-exist");
			cy.contains("Page not Found").should("be.visible");
		});
	});
});
