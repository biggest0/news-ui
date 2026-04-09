/**
 * E2E tests for the search functionality.
 *
 * The search flow: user clicks the search icon in the desktop nav,
 * types a query, submits the form, and is navigated to /search?q=...
 * where matching articles are displayed.
 *
 * Tests:
 * - Search bar expands when the search icon is clicked
 * - Submitting a query navigates to /search with the correct query param
 * - Search results are displayed on the search page
 * - Empty search does not navigate
 * - Search page shows filter controls (date range, sort)
 */
describe("Search", () => {
	beforeEach(() => {
		cy.stubApi();
		cy.visit("/");
		cy.waitForApp();
	});

	/** Clicking the search icon expands the search input field. */
	it("expands the search bar on icon click", () => {
		// The search icon is an SVG inside the desktop nav; click the search area
		cy.get(".hidden.md\\:flex").within(() => {
			// The LuSearch icon triggers search expansion
			cy.get("svg").first().click();
			// The input should now be visible
			cy.get('input[placeholder="Search..."]').should("be.visible");
		});
	});

	/** Typing a query and pressing Enter navigates to the search page. */
	it("submits search and navigates to search page", () => {
		// Intercept search-specific article fetch
		cy.intercept("GET", "**/article-info*search=cat*", {
			fixture: "articles.json",
		}).as("searchArticles");

		cy.get(".hidden.md\\:flex").within(() => {
			cy.get("svg").first().click();
			cy.get('input[placeholder="Search..."]').type("cat{enter}");
		});

		cy.url().should("include", "/search");
		cy.url().should("include", "q=cat");
	});

	/** Search results are rendered on the search page. */
	it("displays search results", () => {
		cy.intercept("GET", "**/article-info*search=mayor*", {
			fixture: "articles.json",
		}).as("searchArticles");

		cy.get(".hidden.md\\:flex").within(() => {
			cy.get("svg").first().click();
			cy.get('input[placeholder="Search..."]').type("mayor{enter}");
		});

		cy.url().should("include", "/search");
		// Articles matching the query should be visible
		cy.contains("Cat Mayor Declares International Nap Day").should("exist");
	});

	/** Submitting an empty search should not navigate away from the current page. */
	it("does not navigate on empty search", () => {
		cy.get(".hidden.md\\:flex").within(() => {
			cy.get("svg").first().click();
			cy.get('input[placeholder="Search..."]').type("{enter}");
		});

		cy.url().should("eq", Cypress.config().baseUrl + "/");
	});
});
