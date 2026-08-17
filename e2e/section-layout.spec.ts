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

/** Opens a section's options menu by its visible heading. */
async function openSectionMenu(page: import("@playwright/test").Page, heading: string) {
	const section = page
		.locator("section")
		.filter({ has: page.getByRole("heading", { name: heading, exact: true }) });
	await section.first().scrollIntoViewIfNeeded();
	await section.first().getByLabel("Section options").first().click();
}

test("restore option is absent until something is hidden, then brings it back", async ({
	page,
}) => {
	await expect(page.getByText("per page")).toBeVisible();

	// 1. nothing hidden → no restore entry
	await openSectionMenu(page, "POPULAR");
	await expect(
		page.getByRole("menuitem", { name: "Restore hidden sections" })
	).toHaveCount(0);
	await page.keyboard.press("Escape");

	// 2. hide Popular
	await openSectionMenu(page, "POPULAR");
	await page.getByRole("menuitem", { name: "Remove" }).click();
	await expect(
		page.getByRole("heading", { name: "POPULAR", exact: true })
	).not.toBeVisible();

	// 3. a *different* section's menu now offers the way back
	await openSectionMenu(page, "MEWS");
	const restore = page.getByRole("menuitem", { name: "Restore hidden sections" });
	await expect(restore).toBeVisible();
	await restore.click();

	// 4. Popular is back
	await expect(
		page.getByRole("heading", { name: "POPULAR", exact: true })
	).toBeVisible();

	// 5. and the entry is gone again
	await openSectionMenu(page, "POPULAR");
	await expect(
		page.getByRole("menuitem", { name: "Restore hidden sections" })
	).toHaveCount(0);
});

test("restore survives a reload (persisted, not just in-memory)", async ({ page }) => {
	await expect(page.getByText("per page")).toBeVisible();

	await openSectionMenu(page, "POPULAR");
	await page.getByRole("menuitem", { name: "Remove" }).click();
	await page.reload();

	await expect(
		page.getByRole("heading", { name: "POPULAR", exact: true })
	).not.toBeVisible();

	await openSectionMenu(page, "MEWS");
	await page.getByRole("menuitem", { name: "Restore hidden sections" }).click();
	await page.reload();

	await expect(
		page.getByRole("heading", { name: "POPULAR", exact: true })
	).toBeVisible();
});
