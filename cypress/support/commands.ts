/**
 * Custom Cypress commands for the Catire Time E2E test suite.
 *
 * Commands:
 * - cy.stubApi()       — Intercepts all API routes with fixture data
 * - cy.login()         — Simulates a logged-in session via localStorage
 * - cy.waitForApp()    — Waits for the initial API calls to resolve (home page only)
 *
 * Intercepts use `**` wildcard patterns so they match regardless of the
 * configured VITE_API_URL (localhost, LAN IP, or production domain).
 */

/**
 * Intercepts every API endpoint the app calls and responds with fixtures.
 * Call this in `beforeEach` so tests run without a live backend.
 */
Cypress.Commands.add("stubApi", () => {
	// Articles
	cy.intercept("GET", "**/article-info*", {
		fixture: "articles.json",
	}).as("getArticles");

	cy.intercept("GET", "**/article-top-ten", {
		fixture: "topTenArticles.json",
	}).as("getTopTen");

	cy.intercept("POST", "**/article-detail", {
		fixture: "articleDetail.json",
	}).as("getArticleDetail");

	cy.intercept("PUT", "**/increment-article-view/*", {
		statusCode: 200,
		body: {},
	}).as("incrementView");

	// Auth
	cy.intercept("POST", "**/auth/user/refresh", {
		statusCode: 401,
		body: { message: "Token expired" },
	}).as("refreshToken");

	cy.intercept("POST", "**/auth/user/login", {
		fixture: "authResponse.json",
	}).as("loginRequest");

	cy.intercept("POST", "**/auth/user/register", {
		fixture: "authResponse.json",
	}).as("registerRequest");

	cy.intercept("POST", "**/auth/user/logout", {
		statusCode: 200,
		body: {},
	}).as("logoutRequest");

	// User article interactions
	cy.intercept("GET", "**/user/article/*/like-status", {
		body: { liked: false, like_count: 0 },
	}).as("likeStatus");

	cy.intercept("POST", "**/user/article/*/like", {
		body: { liked: true, like_count: 1 },
	}).as("toggleLike");

	cy.intercept("POST", "**/user/article/*/read", {
		statusCode: 200,
		body: {},
	}).as("recordRead");

	// Newsletter
	cy.intercept("POST", "**/email-subscribe", {
		body: { message: { exists: false } },
	}).as("subscribe");
});

/**
 * Seeds localStorage with valid auth tokens and user info so the app
 * believes the user is already logged in. Bypasses the login UI flow.
 */
Cypress.Commands.add("login", () => {
	const tokens = {
		accessToken: "test-access-token",
		refreshToken: "test-refresh-token",
	};
	const user = { email: "testcat@catire.com" };

	window.localStorage.setItem("auth_tokens", JSON.stringify(tokens));
	window.localStorage.setItem("auth_user", JSON.stringify(user));

	// Override the refresh intercept to succeed for logged-in sessions
	cy.intercept("POST", "**/auth/user/refresh", {
		body: {
			accessToken: "refreshed-access-token",
			refreshToken: "refreshed-refresh-token",
		},
	}).as("refreshToken");
});

/**
 * Waits for the initial API calls that fire on the HOME page.
 * CategoryBar dispatches loadInitialArticlesInfo, PopularSection dispatches loadTopTenArticles.
 *
 * Only use this after visiting `/` or a category route — other pages
 * (login, register, account, about, contact, disclaimer) do NOT trigger these calls.
 */
Cypress.Commands.add("waitForApp", () => {
	cy.wait(["@getArticles", "@getTopTen"]);
});

// ── Type declarations ────────────────────────────────────────────────

export {};

declare global {
	namespace Cypress {
		interface Chainable {
			stubApi(): Chainable;
			login(): Chainable;
			waitForApp(): Chainable;
		}
	}
}
