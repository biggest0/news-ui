/**
 * Newsletter subscribe flows (ported from cypress/e2e/subscribe.cy.ts in M7):
 * disabled/enabled submit states and the success message.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await stubApi(page);
	await page.goto("/");
	await page.locator("footer").scrollIntoViewIfNeeded();
});

test("disables submit button with empty email", async ({ page }) => {
	await expect(
		page.locator("footer").getByRole("button", { name: "Subscribe" })
	).toBeDisabled();
});

test("enables submit button with valid email", async ({ page }) => {
	await page
		.locator("footer")
		.getByPlaceholder("Enter your email")
		.fill("cat@example.com");
	await expect(
		page.locator("footer").getByRole("button", { name: "Subscribe" })
	).toBeEnabled();
});

test("shows success message after subscribing", async ({ page }) => {
	await page
		.locator("footer")
		.getByPlaceholder("Enter your email")
		.fill("cat@example.com");
	await page.locator("footer").getByRole("button", { name: "Subscribe" }).click();
	await expect(
		page.getByText("Thank you for subscribing! Check your inbox to confirm.")
	).toBeVisible();
});
