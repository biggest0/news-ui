/**
 * The first-visit "how to use" tour: auto-open timing, carousel navigation,
 * dismissal persistence, the live controls actually taking effect, and the
 * responsive bottom-sheet / centred-dialog split.
 *
 * The only spec that does NOT call `dismissOnboarding` — every other spec
 * seeds the tour as already-seen so its modal can't cover the page.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish } from "./support/stubApi";

// deliberately NOT calling dismissOnboarding — we want a first-time visitor
test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await stubApi(page);
});

const dialog = (page: import("@playwright/test").Page) => page.getByRole("dialog");

test("appears on first visit, after the loading overlay has cleared", async ({ page }) => {
	await page.goto("/");

	// the opaque full-screen overlay must be gone before the dialog shows
	await expect(dialog(page)).toBeVisible({ timeout: 10_000 });
	await expect(page.getByText("Loading...")).not.toBeVisible();
	await expect(page.getByText("Welcome to Catire Time")).toBeVisible();
	await expect(page.getByText("Step 1 of 6")).toBeVisible();
});

test("does not appear on other routes", async ({ page }) => {
	await page.goto("/about");
	await page.waitForTimeout(1500);
	await expect(dialog(page)).toHaveCount(0);
});

test("walks to the end and Finish persists the dismissal", async ({ page }) => {
	await page.goto("/");
	await expect(dialog(page)).toBeVisible({ timeout: 10_000 });

	for (let i = 0; i < 5; i++) {
		await page.getByRole("button", { name: "Next" }).click();
	}
	await expect(page.getByText("Step 6 of 6")).toBeVisible();
	await page.getByRole("button", { name: "Got it" }).click();
	await expect(dialog(page)).toHaveCount(0);

	const stored = await page.evaluate(() =>
		JSON.parse(window.localStorage.getItem("onboarding")!)
	);
	expect(stored.seenVersion).toBe(1);
	expect(stored.dismissedVia).toBe("completed");

	await page.reload();
	await page.waitForTimeout(1500);
	await expect(dialog(page)).toHaveCount(0);
});

test("Skip records a skipped dismissal", async ({ page }) => {
	await page.goto("/");
	await expect(dialog(page)).toBeVisible({ timeout: 10_000 });

	await page.getByRole("button", { name: "Skip tour" }).click();
	await expect(dialog(page)).toHaveCount(0);

	const stored = await page.evaluate(() =>
		JSON.parse(window.localStorage.getItem("onboarding")!)
	);
	expect(stored.dismissedVia).toBe("skipped");
});

test("the theme control really flips dark mode", async ({ page }) => {
	await page.goto("/");
	await expect(dialog(page)).toBeVisible({ timeout: 10_000 });

	await page.getByRole("button", { name: "Go to step 2" }).click();
	await expect(page.locator("html")).not.toHaveClass(/dark/);

	await dialog(page).getByRole("button", { name: "Switch to Dark mode" }).click();
	await expect(page.locator("html")).toHaveClass(/dark/);
});

test("the language control refetches with lang=fr", async ({ page }) => {
	await page.goto("/");
	await expect(dialog(page)).toBeVisible({ timeout: 10_000 });

	await page.getByRole("button", { name: "Go to step 2" }).click();

	const frRequest = page.waitForRequest((req) => req.url().includes("lang=fr"));
	await dialog(page).getByRole("button", { name: "French" }).click();
	await frRequest;

	await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("renders as a bottom sheet on mobile", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 780 });
	await page.goto("/");
	await expect(dialog(page)).toBeVisible({ timeout: 10_000 });

	const box = (await dialog(page).boundingBox())!;
	const viewport = page.viewportSize()!;
	// flush to the bottom edge and full width
	expect(Math.round(box.y + box.height)).toBe(viewport.height);
	expect(Math.round(box.width)).toBe(viewport.width);
});

test("renders centred on desktop", async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto("/");
	await expect(dialog(page)).toBeVisible({ timeout: 10_000 });

	const box = (await dialog(page).boundingBox())!;
	const viewport = page.viewportSize()!;
	expect(box.width).toBeLessThan(viewport.width);
	// roughly horizontally centred
	const centreOffset = Math.abs(box.x + box.width / 2 - viewport.width / 2);
	expect(centreOffset).toBeLessThan(4);
});
