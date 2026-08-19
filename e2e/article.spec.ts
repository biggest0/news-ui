/**
 * Article page flows (ported from cypress/e2e/article.cy.ts in M7):
 * direct navigation renders title/paragraphs, view increment fires,
 * similar-articles strip renders.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish, dismissOnboarding } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await dismissOnboarding(page);
	await stubApi(page);
});

test("renders the article detail from the API", async ({ page }) => {
	await page.goto("/article/art-001");
	await expect(
		page.getByRole("heading", { name: "Cat Mayor Declares International Nap Day" })
	).toBeVisible();
	await expect(
		page.getByText("Mayor Whiskers of Catville officially signed")
	).toBeVisible();
});

test("fires the fire-and-forget view increment", async ({ page }) => {
	const viewRequest = page.waitForRequest(
		(req) => req.url().includes("/view") && req.method() === "POST"
	);
	await page.goto("/article/art-001");
	await viewRequest;
});

test("renders the similar-articles strip", async ({ page }) => {
	await page.goto("/article/art-001");
	await expect(page.getByText("MORE LIKE THIS")).toBeVisible();
});

test("back button returns to the previous page", async ({ page }) => {
	// Home → article → Back → home. The card click this test used to make was
	// vestigial (NewsCard expands inline rather than navigating) and became
	// actively harmful once the featured stub started returning data: the same
	// headline appears in the featured hero as a real link, so clicking it
	// pushed an extra /article/top-001 entry and Back landed on another article.
	await page.goto("/");
	await page.goto("/article/art-001");
	await page.getByRole("button", { name: /Back/ }).click();
	await expect(page).not.toHaveURL(/\/article\//);
});

// ── Attribution (audit N3 + N1) ──────────────────────────────────────

test("credits an editor, falling back to the chief editor", async ({ page }) => {
	// the fixture carries no author, so this exercises the fallback
	await page.goto("/article/art-001");
	await expect(page.getByText("By: Meowstein")).toBeVisible();
});

test("renders as a real article with paragraph elements", async ({ page }) => {
	await page.goto("/article/art-001");

	// N1: paragraphs were <div>s, and there was no <article> wrapper at all
	await expect(page.locator("article")).toHaveCount(1);
	expect(await page.locator("article p").count()).toBeGreaterThan(0);
});

test("uses the backend's author when the article has one", async ({ page }) => {
	// Registered after stubApi, so this wins for the detail endpoint
	await page.route(/\/api\/articles\/[^/?]+(\?.*)?$/, async (route) => {
		if (route.request().url().includes("/api/articles?")) return route.fallback();
		const detail = await import("./fixtures/articleDetail.json", {
			with: { type: "json" },
		});
		return route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ ...detail.default, author: "Purrscilla" }),
		});
	});

	await page.goto("/article/art-001");

	await expect(page.getByText("By: Purrscilla")).toBeVisible();
	await expect(page.getByText("By: Meowstein")).toHaveCount(0);
});
