/**
 * Navigation flows (ported from cypress/e2e/navigation.cy.ts in M7):
 * category routing, active-link highlight, footer static pages, history back.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await stubApi(page);
	await page.goto("/");
});

test("navigates to a category page via the category bar", async ({ page }) => {
	await page.getByRole("link", { name: "SCIENCE", exact: true }).click();
	await expect(page).toHaveURL(/\/science/);
});

test("highlights the active category link", async ({ page }) => {
	await page.getByRole("link", { name: "SCIENCE", exact: true }).click();
	await expect(
		page.getByRole("link", { name: "SCIENCE", exact: true })
	).toHaveClass(/text-brand/);
});

test("switches between category pages", async ({ page }) => {
	await page.getByRole("link", { name: "POLITICS", exact: true }).click();
	await expect(page).toHaveURL(/\/politics/);
	await page.getByRole("link", { name: "BUSINESS", exact: true }).click();
	await expect(page).toHaveURL(/\/business/);
});

test("navigates to the Disclaimer page from footer", async ({ page }) => {
	const footer = page.locator("footer");
	await footer.scrollIntoViewIfNeeded();
	await footer.getByText("Disclaimer").click();
	await expect(page).toHaveURL(/\/disclaimer/);
	await expect(page.getByText("DISCLAIMER", { exact: true })).toBeVisible();
});

test("navigates to the Contact page from footer", async ({ page }) => {
	const footer = page.locator("footer");
	await footer.scrollIntoViewIfNeeded();
	await footer.getByText("Contact", { exact: true }).click();
	await expect(page).toHaveURL(/\/contact/);
	await expect(page.getByText("CONTACT", { exact: true })).toBeVisible();
});

test("supports browser back navigation", async ({ page }) => {
	await page.getByRole("link", { name: "TECHNOLOGY", exact: true }).click();
	await expect(page).toHaveURL(/\/technology/);
	await page.goBack();
	await expect(page).toHaveURL(/\/$/);
});
