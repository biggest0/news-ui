/**
 * E2E tests for the newsletter subscription form in the footer.
 *
 * The subscribe form validates email input client-side, posts to the
 * /email-subscribe endpoint, and displays success or error messages.
 *
 * Tests:
 * - Subscribe button is disabled with invalid email
 * - Successful subscription shows a success message
 * - Entering a valid email enables the submit button
 */
describe("Newsletter Subscribe", () => {
	beforeEach(() => {
		cy.stubApi();
		cy.visit("/");
		cy.waitForApp();
	});

	/** The subscribe button is disabled when the email input is empty. */
	it("disables submit button with empty email", () => {
		cy.get("footer").scrollIntoView();
		cy.get("footer").within(() => {
			cy.get('button[type="submit"]')
				.contains("Subscribe")
				.should("be.disabled");
		});
	});

	/** Entering a valid email enables the subscribe button. */
	it("enables submit button with valid email", () => {
		cy.get("footer").scrollIntoView();
		cy.get("footer").within(() => {
			cy.get('input[placeholder="Enter your email"]').type(
				"reader@catire.com"
			);
			cy.get('button[type="submit"]')
				.contains("Subscribe")
				.should("not.be.disabled");
		});
	});

	/** Submitting a valid email shows the success message. */
	it("shows success message after subscribing", () => {
		cy.get("footer").scrollIntoView();
		cy.get("footer").within(() => {
			cy.get('input[placeholder="Enter your email"]').type(
				"reader@catire.com"
			);
			cy.get('button[type="submit"]').contains("Subscribe").click();
		});

		cy.wait("@subscribe");
		cy.contains("Thank you for subscribing!").should("be.visible");
	});
});
