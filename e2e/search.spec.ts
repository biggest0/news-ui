/**
 * Search flows (ported from cypress/e2e/search.cy.ts in M7):
 * expanding the desktop search bar, submit navigation, results, empty guard.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await stubApi(page);
	await page.goto("/");
});

/** Opens the collapsed desktop search input via its labelled toggle button. */
async function openSearch(page: import("@playwright/test").Page) {
	// two controls share the label (toggle + submit); the toggle renders first
	await page.getByRole("button", { name: "Search...", exact: true }).first().click();
	return page.locator("#desktop-search");
}

test("expands the search bar on icon click", async ({ page }) => {
	const input = await openSearch(page);
	await expect(input).toBeVisible();
});

test("submits search and navigates to search page", async ({ page }) => {
	const input = await openSearch(page);
	await input.fill("cat");
	await input.press("Enter");
	await expect(page).toHaveURL(/\/search\?/);
	await expect(page).toHaveURL(/q=cat/);
});

test("displays search results", async ({ page }) => {
	const input = await openSearch(page);
	await input.fill("mayor");
	await input.press("Enter");
	await expect(page).toHaveURL(/\/search/);
	await expect(
		page.getByText("Cat Mayor Declares International Nap Day").first()
	).toBeVisible();
});

test("does not navigate on empty search", async ({ page }) => {
	const input = await openSearch(page);
	await input.press("Enter");
	await expect(page).toHaveURL(/\/$/);
});
