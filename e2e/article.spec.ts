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
