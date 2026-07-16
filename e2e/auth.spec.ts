/**
 * Auth flows (ported from cypress/e2e/auth.cy.ts in M7, adapted to the
 * HttpOnly-cookie world): login/register forms + validation, session on the
 * account page, logout clearing the persisted user (the session hint).
 */
import { test, expect } from "@playwright/test";
import { stubApi, loginSession, useEnglish } from "./support/stubApi";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await stubApi(page);
});

test.describe("Login", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/login");
	});

	test("renders the login form", async ({ page }) => {
		await expect(page.getByText("LOG IN", { exact: true })).toBeVisible();
		await expect(page.locator("#email")).toBeVisible();
		await expect(page.locator("#password")).toBeVisible();
		await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
	});

	test("shows validation error for empty fields", async ({ page }) => {
		await page.getByRole("button", { name: "Log In" }).click();
		await expect(page.getByText("Please fill in all fields.")).toBeVisible();
	});

	test("logs in successfully and navigates to account", async ({ page }) => {
		await page.locator("#email").fill("testcat@catire.com");
		await page.locator("#password").fill("password123");
		await page.getByRole("button", { name: "Log In" }).click();
		await expect(page).toHaveURL(/\/account/);
	});

	test("navigates to register page via link", async ({ page }) => {
		await expect(page.getByText("Don't have an account?")).toBeVisible();
		await page.getByRole("link", { name: "Register" }).click();
		await expect(page).toHaveURL(/\/register/);
	});
});

test.describe("Register", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/register");
	});

	test("shows error when passwords do not match", async ({ page }) => {
		await page.locator("#email").fill("newcat@catire.com");
		await page.locator("#password").fill("password123");
		await page.locator("#confirmPassword").fill("differentpassword");
		await page.getByRole("button", { name: "Register" }).click();
		await expect(page.getByText("Passwords do not match.")).toBeVisible();
	});

	test("registers successfully and shows the verify-email screen", async ({ page }) => {
		await page.locator("#email").fill("newcat@catire.com");
		await page.locator("#password").fill("password123");
		await page.locator("#confirmPassword").fill("password123");
		await page.getByRole("button", { name: "Register" }).click();
		// registration now leads to email verification, not straight to /account
		await expect(page.getByText("Check Your Inbox")).toBeVisible();
	});
});

test.describe("Account", () => {
	test("shows user email on account page when logged in", async ({ page }) => {
		await loginSession(page);
		await page.goto("/account");
		await expect(page.getByText("testcat@catire.com")).toBeVisible();
	});

	test("logout clears the persisted session hint", async ({ page }) => {
		await loginSession(page);
		await page.goto("/account");
		await page.getByText("Log Out").click();
		await expect
			.poll(async () =>
				page.evaluate(() => window.localStorage.getItem("auth_user"))
			)
			.toBeNull();
	});
});
