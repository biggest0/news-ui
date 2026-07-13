/**
 * Theme toggle flows (ported from cypress/e2e/theme.cy.ts in M7):
 * class-based dark mode on <html>, round-trip toggling, persistence.
 * Labels are the localized THEME.SWITCH_TO strings ("Switch to Dark mode").
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await stubApi(page);
	await page.goto("/");
});

test("starts in light mode by default", async ({ page }) => {
	await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("toggles to dark mode on click", async ({ page }) => {
	await page.getByRole("button", { name: "Switch to Dark mode" }).click();
	await expect(page.locator("html")).toHaveClass(/dark/);
});

test("toggles back to light mode on second click", async ({ page }) => {
	await page.getByRole("button", { name: "Switch to Dark mode" }).click();
	await expect(page.locator("html")).toHaveClass(/dark/);
	await page.getByRole("button", { name: "Switch to Light mode" }).click();
	await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("persists dark mode across page reload", async ({ page }) => {
	await page.getByRole("button", { name: "Switch to Dark mode" }).click();
	await expect(page.locator("html")).toHaveClass(/dark/);
	await page.reload();
	await expect(page.locator("html")).toHaveClass(/dark/);
});
