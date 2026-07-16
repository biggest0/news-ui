/**
 * Home page flows (ported from cypress/e2e/home.cy.ts in M7):
 * title, category bar, article cards from the API, footer + footer nav.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await stubApi(page);
	await page.goto("/");
});

test("displays the app title in the header", async ({ page }) => {
	// the wordmark renders as "Ç" + "ATIRE TIME"; scope to the desktop nav
	// (a hidden mobile variant also exists in the DOM)
	await expect(
		page.locator("div.hidden.md\\:flex").getByText("ATIRE TIME")
	).toBeVisible();
});

test("renders the category bar with all categories", async ({ page }) => {
	for (const cat of [
		"WORLD",
		"LIFESTYLE",
		"SCIENCE",
		"TECHNOLOGY",
		"BUSINESS",
		"SPORT",
		"POLITICS",
		"OTHER",
	]) {
		await expect(page.getByRole("link", { name: cat, exact: true })).toBeVisible();
	}
});

test("displays article titles from the API", async ({ page }) => {
	await expect(
		page.getByText("Cat Mayor Declares International Nap Day").first()
	).toBeVisible();
	await expect(
		page.getByText("Fish Stocks Hit All-Time High After Cat Boycott").first()
	).toBeVisible();
});

test("renders the footer with copyright and links", async ({ page }) => {
	const footer = page.locator("footer");
	await footer.scrollIntoViewIfNeeded();
	await expect(footer.getByText("Catire Time © 2025")).toBeVisible();
	await expect(footer.getByText("Disclaimer")).toBeVisible();
	await expect(footer.getByText("About Us")).toBeVisible();
	await expect(footer.getByText("Contact")).toBeVisible();
});

test("navigates to About page from footer", async ({ page }) => {
	const footer = page.locator("footer");
	await footer.scrollIntoViewIfNeeded();
	await footer.getByText("About Us").click();
	await expect(page).toHaveURL(/\/about/);
	await expect(page.getByRole("heading", { name: "ABOUT", exact: true })).toBeVisible();
});
