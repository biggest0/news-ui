import type { Page } from "@playwright/test";

import articles from "../fixtures/articles.json" with { type: "json" };
import topTen from "../fixtures/topTenArticles.json" with { type: "json" };
import articleDetail from "../fixtures/articleDetail.json" with { type: "json" };
import authResponse from "../fixtures/authResponse.json" with { type: "json" };

/**
 * Stubs every backend route the app calls (current API surface, post-M5
 * RTK Query migration) so e2e tests run without a live server. Patterns use
 * `**` hosts so they match any configured VITE_API_URL.
 *
 * Route registration order matters in Playwright (last registered wins), so
 * the most specific routes are registered LAST.
 */
export async function stubApi(page: Page) {
	const json = (body: unknown, status = 200) => ({
		status,
		contentType: "application/json",
		body: JSON.stringify(body),
	});

	// Articles — lists (home/category/subcategory) share one endpoint
	await page.route("**/api/articles?*", (route) => route.fulfill(json(articles)));
	await page.route("**/api/articles/top*", (route) => route.fulfill(json(topTen)));
	await page.route("**/api/articles/featured*", (route) =>
		route.fulfill(json({ articles: topTen }))
	);
	await page.route("**/api/articles/search/keyword*", (route) =>
		route.fulfill(json(articles))
	);
	await page.route("**/api/articles/search/similar*", (route) =>
		route.fulfill(json(articles))
	);
	await page.route("**/api/articles/*/similar*", (route) =>
		route.fulfill(json({ articles: topTen.slice(0, 3) }))
	);
	await page.route("**/api/articles/*/view", (route) => route.fulfill(json({})));
	await page.route("**/api/articles/*/read", (route) => route.fulfill(json({})));
	await page.route("**/api/articles/*/like", (route) =>
		route.fulfill(json({ liked: true, like_count: 1 }))
	);
	// Article detail — register after the more specific /articles/* routes
	await page.route(/\/api\/articles\/[^/?]+(\?.*)?$/, (route) => {
		if (route.request().url().includes("/api/articles?")) return route.fallback();
		return route.fulfill(json(articleDetail));
	});

	// Cat facts + recommendations
	await page.route("**/api/cat-facts*", (route) =>
		route.fulfill(
			json({
				facts: [
					{ _id: "cf-1", title: "Whisker fact", fact: "Cats have 24 whiskers." },
					{ _id: "cf-2", title: "Nap fact", fact: "Cats sleep 16 hours a day." },
				],
			})
		)
	);
	await page.route("**/api/recommendations*", (route) =>
		route.fulfill(json({ articles: [] }))
	);

	// User content
	await page.route("**/api/user/history*", (route) =>
		route.fulfill(json({ articles: [], count: 0 }))
	);

	// Auth — anonymous by default (refresh denied); login/register succeed
	await page.route("**/auth/user/refresh", (route) =>
		route.fulfill(json({ message: "Token expired" }, 401))
	);
	await page.route("**/auth/user/login", (route) =>
		route.fulfill(json(authResponse))
	);
	await page.route("**/auth/user/register", (route) =>
		route.fulfill(json(authResponse))
	);
	await page.route("**/auth/user/logout", (route) => route.fulfill(json({})));

	// Newsletter
	await page.route("**/api/subscriptions", (route) =>
		route.fulfill(json({ exists: false }))
	);
}

/**
 * Seeds the persisted user (the app's session hint) so the app treats the
 * session as logged in, and makes the silent refresh succeed. Mirrors the
 * old cy.login() but for the HttpOnly-cookie world: only auth_user exists in
 * localStorage; tokens never touch JS.
 */
export async function loginSession(page: Page) {
	await page.addInitScript(() => {
		window.localStorage.setItem(
			"auth_user",
			JSON.stringify({ email: "testcat@catire.com" })
		);
	});
	await page.route("**/auth/user/refresh", (route) =>
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ user: { email: "testcat@catire.com" } }),
		})
	);
}

/**
 * Defaults the UI to English for fresh contexts. Only sets the language when
 * none is stored, so in-test language switches survive reloads.
 */
export async function useEnglish(page: Page) {
	await page.addInitScript(() => {
		if (!window.localStorage.getItem("i18nextLng")) {
			window.localStorage.setItem("i18nextLng", "en");
		}
	});
}
