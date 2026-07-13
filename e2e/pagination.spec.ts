/**
 * News-list view modes (new in M7 — previously uncovered): switching between
 * infinite scroll and page pagination via the Mews section menu.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await stubApi(page);
	await page.goto("/");
});

/** Opens the Mews section's options menu (trigger next to the MEWS header). */
async function openMewsMenu(page: import("@playwright/test").Page) {
	const mewsSection = page
		.locator("section")
		.filter({ has: page.getByRole("heading", { name: "MEWS", exact: true }) });
	await mewsSection.scrollIntoViewIfNeeded();
	await mewsSection.getByLabel("Section options").first().click();
}

test("switches the news list between pagination and scroll modes", async ({ page }) => {
	// the app defaults to page-pagination mode — controls visible up front
	await expect(page.getByText("per page")).toBeVisible();

	await openMewsMenu(page);
	await page.getByRole("menuitem", { name: "Scroll View" }).click();
	await expect(page.getByText("per page")).not.toBeVisible();

	await openMewsMenu(page);
	await page.getByRole("menuitem", { name: "Page View" }).click();
	await expect(page.getByText("per page")).toBeVisible();
});

test("collapse folds the news list content", async ({ page }) => {
	// wait for the list to be interactive before driving the menu
	await expect(page.getByText("per page")).toBeVisible();
	await openMewsMenu(page);
	await page.getByRole("menuitem", { name: "Collapse" }).click();
	// content is clipped via the grid-rows trick (overflow-clipped elements
	// still count as "visible" to Playwright, so assert the collapsed state)
	const mewsSection = page
		.locator("section")
		.filter({ has: page.getByRole("heading", { name: "MEWS", exact: true }) });
	await expect(mewsSection.locator("div.grid").first()).toHaveClass(
		/grid-rows-\[0fr\]/
	);
});
