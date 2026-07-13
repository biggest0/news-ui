/**
 * Language switching (new in M7 — previously uncovered): EN↔FR via the
 * header menu updates content IN PLACE (M5 retired the page remount),
 * flips <html lang>, and refetches article data with the new lang param.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await stubApi(page);
	await page.goto("/");
});

test("switches to French in place and refetches with lang=fr", async ({ page }) => {
	// mark the <main> node — it must survive the toggle (no remount)
	await page.evaluate(() => {
		(document.querySelector("main") as HTMLElement & { __marker?: string }).__marker = "pre";
	});

	const frRequest = page.waitForRequest((req) =>
		req.url().includes("lang=fr")
	);

	await page.getByRole("button", { name: "Language" }).click();
	await page.getByRole("menuitem", { name: /French/ }).click();

	await frRequest;
	await expect(page.locator("html")).toHaveAttribute("lang", "fr");
	// category bar re-rendered in French
	await expect(page.getByRole("link", { name: "MONDE", exact: true })).toBeVisible();
	// same DOM node → no page remount
	const marker = await page.evaluate(
		() => (document.querySelector("main") as HTMLElement & { __marker?: string }).__marker
	);
	expect(marker).toBe("pre");
});

test("persists the selected language across reloads", async ({ page }) => {
	await page.getByRole("button", { name: "Language" }).click();
	await page.getByRole("menuitem", { name: /French/ }).click();
	await expect(page.locator("html")).toHaveAttribute("lang", "fr");

	await page.reload();
	await expect(page.locator("html")).toHaveAttribute("lang", "fr");
	await expect(page.getByRole("link", { name: "MONDE", exact: true })).toBeVisible();
});
