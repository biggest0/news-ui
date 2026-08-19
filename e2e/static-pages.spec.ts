/**
 * Static pages (ported from cypress/e2e/static-pages.cy.ts in M7):
 * About, Contact, and Disclaimer content.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish, dismissOnboarding } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await dismissOnboarding(page);
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

test.describe("Privacy policy", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/privacy");
	});

	test("displays the policy with its section headings", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "PRIVACY POLICY", exact: true })
		).toBeVisible();
		await expect(page.getByRole("heading", { name: "What we collect" })).toBeVisible();
		await expect(page.getByRole("heading", { name: "Cookies" })).toBeVisible();
	});

	test("discloses the things AdSense and privacy law require", async ({ page }) => {
		// third-party ad cookies and personalisation
		await expect(page.getByText(/Google AdSense/)).toBeVisible();
		// a contact route for access and deletion requests
		await expect(page.getByText(/catirecontact@gmail\.com/).first()).toBeVisible();
		// cross-border transfer
		await expect(page.getByText(/outside Canada/)).toBeVisible();
	});

	test("is reachable from the footer", async ({ page }) => {
		await page.goto("/");
		await page.locator("footer").getByRole("link", { name: "Privacy" }).click();
		await expect(page).toHaveURL(/\/privacy/);
		await expect(
			page.getByRole("heading", { name: "PRIVACY POLICY", exact: true })
		).toBeVisible();
	});
});

// ── Per-page metadata (audit M2) ─────────────────────────────────────

test.describe("page metadata", () => {
	const routes = [
		{ path: "/", title: /Satirical news, short enough to finish \| Catire Time/ },
		{ path: "/science", title: /Science \| Catire Time/ },
		{ path: "/politics", title: /Politics \| Catire Time/ },
		{ path: "/about", title: /About \| Catire Time/ },
		{ path: "/privacy", title: /Privacy Policy \| Catire Time/ },
		{ path: "/blog", title: /Blog \| Catire Time/ },
	];

	for (const route of routes) {
		test(`${route.path} has its own title`, async ({ page }) => {
			await page.goto(route.path);
			await expect(page).toHaveTitle(route.title);
		});
	}

	test("each page has exactly one title and one description", async ({ page }) => {
		await page.goto("/about");
		await expect(page.locator("head title")).toHaveCount(1);
		await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
	});

	test("the description is page-specific, not the site default", async ({ page }) => {
		await page.goto("/privacy");
		// toHaveAttribute retries; getAttribute reads once and can beat the effect
		await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
			"content",
			/stays on your device/
		);
	});

	test("open graph tags follow the page too", async ({ page }) => {
		await page.goto("/blog");
		await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute(
			"content",
			/Blog \| Catire Time/
		);
	});

	test("titles are localised", async ({ page }) => {
		await page.goto("/about");
		await page.getByLabel("Language").click();
		await page.getByRole("menuitem", { name: /French/ }).click();
		await expect(page).toHaveTitle(/À propos \| Çatire Time/);
	});
});
