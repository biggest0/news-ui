/**
 * Static pages (ported from cypress/e2e/static-pages.cy.ts in M7):
 * About, Contact, and Disclaimer content.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await stubApi(page);
});

test.describe("About", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/about");
	});

	test("displays the About page title and mission", async ({ page }) => {
		await expect(page.getByRole("heading", { name: "ABOUT", exact: true })).toBeVisible();
		await expect(page.getByRole("heading", { name: "Our Mission" })).toBeVisible();
	});

	test("links to the disclaimer page", async ({ page }) => {
		await page.getByText("Full Disclaimer").click();
		await expect(page).toHaveURL(/\/disclaimer/);
	});
});

test.describe("Contact", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/contact");
	});

	test("displays the Contact page with email and socials", async ({ page }) => {
		await expect(page.getByRole("heading", { name: "CONTACT", exact: true })).toBeVisible();
		await expect(page.getByText("catirecontact@gmail.com")).toBeVisible();
		await expect(page.getByText("Instagram: catiretime")).toBeVisible();
		await expect(page.getByText("YouTube: catiretime")).toBeVisible();
	});
});

test.describe("Disclaimer", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/disclaimer");
	});

	test("displays the Disclaimer title and content", async ({ page }) => {
		await expect(page.getByRole("heading", { name: "DISCLAIMER", exact: true })).toBeVisible();
		await expect(page.getByText("entertainment purposes only")).toBeVisible();
	});
});
