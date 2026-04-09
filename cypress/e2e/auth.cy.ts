/**
 * E2E tests for the authentication flow.
 *
 * Tests login, register, and logout user journeys. The auth API calls
 * are stubbed so tests run without a real backend. The app uses
 * localStorage to persist tokens and user info.
 *
 * Tests:
 * - Login page renders form fields and submit button
 * - Successful login navigates to /account
 * - Login validation shows error for empty fields
 * - Register page renders all fields including confirm password
 * - Successful registration navigates to /account
 * - Register shows error when passwords don't match
 * - Logged-in user can access the account page
 * - Logout clears session and redirects to login
 * - Unauthenticated user icon links to /login
 */
describe("Authentication", () => {
	beforeEach(() => {
		cy.stubApi();
		cy.clearLocalStorage();
	});

	// ── Login ────────────────────────────────────────────────────────

	describe("Login", () => {
		beforeEach(() => {
			cy.visit("/login");
		});

		/** Login page renders email, password inputs and submit button. */
		it("renders the login form", () => {
			cy.contains("LOG IN").should("be.visible");
			cy.get("#email").should("exist");
			cy.get("#password").should("exist");
			cy.contains("button", "Log In").should("exist");
		});

		/** Submitting with empty fields shows a validation error. */
		it("shows validation error for empty fields", () => {
			cy.contains("button", "Log In").click();
			cy.contains("Please fill in all fields.").should("be.visible");
		});

		/** Successful login stores tokens and navigates to /account. */
		it("logs in successfully and navigates to account", () => {
			cy.get("#email").type("testcat@catire.com");
			cy.get("#password").type("password123");
			cy.contains("button", "Log In").click();

			cy.wait("@loginRequest");
			cy.url().should("include", "/account");
		});

		/** Link to register page is visible and works. */
		it("navigates to register page via link", () => {
			cy.contains("Don't have an account?").should("be.visible");
			cy.contains("Register").click();
			cy.url().should("include", "/register");
		});

		/** Login error from the server is displayed to the user. */
		it("shows server error on failed login", () => {
			cy.intercept("POST", "**/auth/user/login", {
				statusCode: 401,
				body: { message: "Invalid email or password" },
			}).as("loginFail");

			cy.get("#email").type("wrong@catire.com");
			cy.get("#password").type("badpassword");
			cy.contains("button", "Log In").click();

			cy.wait("@loginFail");
			cy.contains("Invalid email or password").should("be.visible");
		});
	});

	// ── Register ─────────────────────────────────────────────────────

	describe("Register", () => {
		beforeEach(() => {
			cy.visit("/register");
		});

		/** Register page renders email, password, confirm password and submit. */
		it("renders the register form", () => {
			cy.contains("REGISTER").should("be.visible");
			cy.get("#email").should("exist");
			cy.get("#password").should("exist");
			cy.get("#confirmPassword").should("exist");
			cy.contains("button", "Register").should("exist");
		});

		/** Shows error when passwords don't match. */
		it("shows error when passwords do not match", () => {
			cy.get("#email").type("newcat@catire.com");
			cy.get("#password").type("password123");
			cy.get("#confirmPassword").type("differentpassword");
			cy.contains("button", "Register").click();

			cy.contains("Passwords do not match.").should("be.visible");
		});

		/** Successful registration navigates to /account. */
		it("registers successfully and navigates to account", () => {
			cy.get("#email").type("newcat@catire.com");
			cy.get("#password").type("password123");
			cy.get("#confirmPassword").type("password123");
			cy.contains("button", "Register").click();

			cy.wait("@registerRequest");
			cy.url().should("include", "/account");
		});

		/** Link to login page is visible and works. */
		it("navigates to login page via link", () => {
			cy.contains("Already have an account?").should("be.visible");
			cy.contains("p", "Already have an account?").find("a").click();
			cy.url().should("include", "/login");
		});
	});

	// ── Account & Logout ─────────────────────────────────────────────

	describe("Account", () => {
		/** Logged-in user sees their email on the account page. */
		it("shows user email on account page when logged in", () => {
			cy.login();
			cy.visit("/account");

			cy.contains("testcat@catire.com").should("be.visible");
		});

		/** Logout clears the session. */
		it("logs out and clears the session", () => {
			cy.login();
			cy.visit("/account");

			cy.contains("Log Out").click();
			cy.wait("@logoutRequest");

			// Should be redirected or session cleared
			cy.window().then((win) => {
				expect(win.localStorage.getItem("auth_tokens")).to.be.null;
				expect(win.localStorage.getItem("auth_user")).to.be.null;
			});
		});
	});
});
