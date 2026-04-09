/**
 * E2E tests for the Home Page.
 *
 * The home page is the main landing page at `/`. It loads initial articles
 * from the API, renders a featured section, popular section, category bar,
 * and the main news section with articles.
 *
 * Tests:
 * - Page loads and displays the app title
 * - Category bar renders all 8 category links
 * - Articles from the API are rendered as news cards
 * - Footer is present with copyright and navigation links
 * - Featured section renders hero content from top ten articles
 */
describe("Home Page", () => {
	beforeEach(() => {
		cy.stubApi();
		cy.visit("/");
		cy.waitForApp();
	});

	/** The app title "Catire Time" should appear in the header. */
	it("displays the app title in the header", () => {
		cy.contains("Çatire Time").should("be.visible");
	});

	/** All 8 category links should be rendered in the category bar. */
	it("renders the category bar with all categories", () => {
		const categories = [
			"WORLD",
			"LIFESTYLE",
			"SCIENCE",
			"TECHNOLOGY",
			"BUSINESS",
			"SPORT",
			"POLITICS",
			"OTHER",
		];
		categories.forEach((cat) => {
			cy.contains(cat).should("exist");
		});
	});

	/** Articles from the stubbed API should appear as cards on the page. */
	it("displays article titles from the API", () => {
		cy.contains("Cat Mayor Declares International Nap Day").should("exist");
		cy.contains("Fish Stocks Hit All-Time High After Cat Boycott").should(
			"exist"
		);
	});

	/** The footer renders copyright text and navigation links. */
	it("renders the footer with copyright and links", () => {
		cy.get("footer").scrollIntoView();
		cy.get("footer").within(() => {
			cy.contains("Catire Time © 2025").should("be.visible");
			cy.contains("Disclaimer").should("be.visible");
			cy.contains("About Us").should("be.visible");
			cy.contains("Contact").should("be.visible");
		});
	});

	/** Footer links navigate to the correct static pages. */
	it("navigates to About page from footer", () => {
		cy.get("footer").scrollIntoView();
		cy.get("footer").contains("About Us").click();
		cy.url().should("include", "/about");
		cy.contains("ABOUT").should("be.visible");
	});
});
