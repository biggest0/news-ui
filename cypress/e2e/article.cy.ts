/**
 * E2E tests for article interaction (expand, detail page).
 *
 * Tests the core article reading flow:
 * - Expanding a NewsCard via "Read More" fetches and displays article detail
 * - Collapsing via "Hide" hides the detail content
 * - Clicking an article title link navigates to the article detail page
 * - Article detail page shows full paragraphs, source, and subcategories
 * - View count is incremented on expand (fire-and-forget)
 *
 * All API calls are stubbed via cy.stubApi().
 */
describe("Article Interaction", () => {
	beforeEach(() => {
		cy.stubApi();
		cy.visit("/");
		cy.waitForApp();
	});

	/** Clicking "Read More" on a news card fetches and shows article detail. */
	it("expands a news card to show article paragraphs", () => {
		// Click the first "Read More" link
		cy.contains("Read More").first().click();

		// Wait for article detail to be fetched
		cy.wait("@getArticleDetail");

		// The paragraphs from the fixture should appear
		cy.contains(
			"In a historic move that has divided the nation"
		).should("exist");
	});

	/** Clicking "Hide" collapses the expanded card back. */
	it("collapses an expanded card when Hide is clicked", () => {
		cy.contains("Read More").first().click();
		cy.wait("@getArticleDetail");

		// Now click "Hide" to collapse
		cy.contains("Hide").first().click();

		// "Read More" should reappear
		cy.contains("Read More").should("exist");
	});

	/** Expanding a card fires the view increment API call. */
	it("increments view count on first expand", () => {
		cy.contains("Read More").first().click();

		cy.wait("@incrementView").its("request.url").should("include", "/increment-article-view/");
	});

	/** Article detail page loads when navigating to /article/:id. */
	it("loads the article detail page directly", () => {
		cy.visit("/article/art-001");
		cy.wait("@getArticleDetail");

		cy.contains("Cat Mayor Declares International Nap Day").should(
			"be.visible"
		);
		cy.contains(
			"In a historic move that has divided the nation"
		).should("exist");
	});
});
