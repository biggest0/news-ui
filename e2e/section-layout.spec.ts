/**
 * Home-layout recovery: removing a section other than Mews leaves no trace on
 * the page, so the "Restore hidden sections" entry in any section's options
 * menu is the only way back. Covers the full round-trip (hide → restore) and
 * its persistence, which the useSectionDropdown unit tests can't reach — they
 * assert the option list, not the effect on the rendered page.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish, dismissOnboarding } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await dismissOnboarding(page);
	await stubApi(page);
	await page.goto("/");
});

type Page = import("@playwright/test").Page;

/** base-ui renders an inert backdrop while a menu is open/closing; clicking
 *  through it silently fails, so always settle before driving another menu. */
async function expectNoOpenMenu(page: Page) {
	await expect(page.getByRole("menu")).toHaveCount(0);
}

/** Opens a section's options menu by its visible heading. */
async function openSectionMenu(page: Page, heading: string) {
	await expectNoOpenMenu(page);

	const section = page
		.locator("section")
		.filter({ has: page.getByRole("heading", { name: heading, exact: true }) })
		.first();

	await section.scrollIntoViewIfNeeded();
	await section.getByLabel("Section options").first().click();
	await expect(page.getByRole("menu")).toBeVisible();
}

async function closeMenu(page: Page) {
	await page.keyboard.press("Escape");
	await expectNoOpenMenu(page);
}

const restoreItem = (page: Page) =>
	page.getByRole("menuitem", { name: "Restore hidden sections" });

const popularHeading = (page: Page) =>
	page.getByRole("heading", { name: "POPULAR", exact: true });

test("restore option is absent until something is hidden, then brings it back", async ({
	page,
}) => {
	await expect(page.getByText("per page")).toBeVisible();

	// nothing hidden → no restore entry, and remove from the same open menu
	await openSectionMenu(page, "POPULAR");
	await expect(restoreItem(page)).toHaveCount(0);
	await page.getByRole("menuitem", { name: "Remove" }).click();
	await expect(popularHeading(page)).not.toBeVisible();
	await expectNoOpenMenu(page);

	// a *different* section's menu now offers the way back
	await openSectionMenu(page, "MEWS");
	await expect(restoreItem(page)).toBeVisible();
	await restoreItem(page).click();
	await expect(popularHeading(page)).toBeVisible();
	await expectNoOpenMenu(page);

	// and the entry is gone again
	await openSectionMenu(page, "POPULAR");
	await expect(restoreItem(page)).toHaveCount(0);
	await closeMenu(page);
});

test("restore survives a reload (persisted, not just in-memory)", async ({ page }) => {
	await expect(page.getByText("per page")).toBeVisible();

	await openSectionMenu(page, "POPULAR");
	await page.getByRole("menuitem", { name: "Remove" }).click();
	await page.reload();
	await expect(popularHeading(page)).not.toBeVisible();

	await openSectionMenu(page, "MEWS");
	await restoreItem(page).click();
	await page.reload();
	await expect(popularHeading(page)).toBeVisible();
});
