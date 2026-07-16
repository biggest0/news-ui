/**
 * Article page flows (ported from cypress/e2e/article.cy.ts in M7):
 * direct navigation renders title/paragraphs, view increment fires,
 * similar-articles strip renders.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
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
	await page.goto("/");
	await page
		.getByText("Cat Mayor Declares International Nap Day")
		.first()
		.click();
	// NewsCard expands inline on home; navigate directly instead
	await page.goto("/article/art-001");
	await page.getByRole("button", { name: /Back/ }).click();
	await expect(page).not.toHaveURL(/\/article\//);
});
