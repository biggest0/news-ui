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
	expect(stored.seenVersion).toBe(1);
	expect(stored.dismissedVia).toBe("skipped");

	// skipping must stick just as firmly as finishing
	await page.reload();
	await page.waitForTimeout(1500);
	await expect(dialog(page)).toHaveCount(0);
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

test("keeps a constant height across every step", async ({ page }) => {
	await page.goto("/");
	await expect(dialog(page)).toBeVisible({ timeout: 10_000 });

	const heights: number[] = [];
	for (let index = 1; index <= 6; index++) {
		await page.getByRole("button", { name: `Go to step ${index}` }).click();
		heights.push(Math.round((await dialog(page).boundingBox())!.height));
	}

	// A height that changes per slide makes the dialog jump under the cursor,
	// and can slide the Next button out from under a mid-click pointer.
	expect(new Set(heights).size, `heights were ${heights.join(", ")}`).toBe(1);
});

test("stays fully reachable on a short viewport", async ({ page }) => {
	// The fixed height is taller than the tallest slide used to be, so make
	// sure a landscape phone can still reach the top of the dialog.
	await page.setViewportSize({ width: 640, height: 420 });
	await page.goto("/");
	await expect(dialog(page)).toBeVisible({ timeout: 10_000 });

	const box = (await dialog(page).boundingBox())!;
	expect(box.y).toBeGreaterThanOrEqual(0);
	await expect(page.getByText("Welcome to Catire Time")).toBeVisible();
	await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
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

// ── Re-opening after dismissal ───────────────────────────────────────

test.describe("re-opening", () => {
	// these start from an already-dismissed state, like a returning visitor
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			window.localStorage.setItem(
				"onboarding",
				JSON.stringify({
					seenVersion: 1,
					completedAt: "2026-01-01T00:00:00.000Z",
					dismissedVia: "completed",
				})
			);
		});
	});

	test("re-opens from the About page and returns focus to the button", async ({
		page,
	}) => {
		await page.goto("/about");
		await expect(dialog(page)).toHaveCount(0);

		const launcher = page.getByRole("button", { name: "How to use this site" });
		await launcher.click();
		await expect(dialog(page)).toBeVisible();
		await expect(page.getByText("Welcome to Catire Time")).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(dialog(page)).toHaveCount(0);
		// base-ui restores focus to the previously focused element, no ref needed
		await expect(launcher).toBeFocused();
	});

	test("re-opens from the mobile drawer footer, closing the drawer as it goes", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 390, height: 780 });
		await page.goto("/");

		await page.getByLabel("Toggle menu").click();
		const drawer = page.getByLabel("Navigation menu");
		await expect(drawer).toBeVisible();

		// it lives in the drawer's footer row, not among the navigation links
		await expect(drawer.getByRole("link", { name: "Disclaimer" })).toBeVisible();

		await drawer.getByRole("button", { name: "How to use this site" }).click();

		// the drawer must be gone, or it would stack on top of the tour
		await expect(drawer).toHaveCount(0);
		await expect(dialog(page)).toBeVisible();
		await expect(page.getByText("Welcome to Catire Time")).toBeVisible();
	});

	test("dismissing a re-opened tour does not re-arm the auto-open", async ({
		page,
	}) => {
		await page.goto("/about");
		await page.getByRole("button", { name: "How to use this site" }).click();
		await expect(dialog(page)).toBeVisible();
		await page.getByRole("button", { name: "Skip tour" }).click();

		await page.goto("/");
		await page.waitForTimeout(1500);
		await expect(dialog(page)).toHaveCount(0);
	});
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
