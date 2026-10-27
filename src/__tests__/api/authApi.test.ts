/**
 * Unit tests for the register/login error handling in src/api/authApi.ts
 *
 * The backend answers failures with `{ error }`. These tests pin down which
 * message each kind of failure throws, and (through the real authService) what
 * the register/login forms end up showing. Global fetch is stubbed.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

import { postLogin, postRegister } from "@/api/authApi";
import { loginUser, registerUser } from "@/service/authService";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

// ── Helpers ──────────────────────────────────────────────────────────

/** Builds a JSON Response for the fetch stub. */
function jsonResponse(body: unknown, status: number) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

const credentials = { email: "cat@example.com", password: "meow1234" };

beforeEach(() => {
	fetchMock.mockReset();
});

// ── postRegister ─────────────────────────────────────────────────────

describe("postRegister", () => {
	it("returns the user and sends cookies on success", async () => {
		fetchMock.mockResolvedValue(
			jsonResponse({ user: { id: "u1", email: "cat@example.com" } }, 201)
		);

		const result = await postRegister(credentials);

		expect(result).toEqual({ user: { id: "u1", email: "cat@example.com" } });
		expect(fetchMock.mock.calls[0][1]).toMatchObject({
			method: "POST",
			credentials: "include",
		});
	});

	it("throws the server's reason for a 409", async () => {
		fetchMock.mockResolvedValue(jsonResponse({ error: "Email already in use" }, 409));

		await expect(postRegister(credentials)).rejects.toThrow("Email already in use");
	});

	it("throws the server's reason for a 400", async () => {
		fetchMock.mockResolvedValue(jsonResponse({ error: "Invalid email format" }, 400));

		await expect(postRegister(credentials)).rejects.toThrow("Invalid email format");
	});

	it("keeps the generic HTTP error for a 5xx, whatever the body says", async () => {
		fetchMock.mockResolvedValue(
			jsonResponse({ error: "Unexpected Error", detail: "Something went wrong." }, 500)
		);

		await expect(postRegister(credentials)).rejects.toThrow("HTTP error! status: 500");
	});

	it("falls back to the generic HTTP error when the body isn't JSON", async () => {
		fetchMock.mockResolvedValue(new Response("<html>Bad Gateway</html>", { status: 502 }));

		await expect(postRegister(credentials)).rejects.toThrow("HTTP error! status: 502");
	});

	it("falls back to the generic HTTP error when a 4xx body has no error field", async () => {
		fetchMock.mockResolvedValue(jsonResponse({}, 400));

		await expect(postRegister(credentials)).rejects.toThrow("HTTP error! status: 400");
	});
});

// ── postLogin ────────────────────────────────────────────────────────

describe("postLogin", () => {
	it("throws the server's reason for a 401", async () => {
		fetchMock.mockResolvedValue(jsonResponse({ error: "Invalid email or password." }, 401));

		await expect(postLogin(credentials)).rejects.toThrow("Invalid email or password.");
	});

	it("throws the rate limiter's message for a 429", async () => {
		fetchMock.mockResolvedValue(
			jsonResponse({ error: "Too many authentication attempts, please try again later." }, 429)
		);

		await expect(postLogin(credentials)).rejects.toThrow(
			"Too many authentication attempts, please try again later."
		);
	});

	it("keeps the generic HTTP error for a 5xx", async () => {
		fetchMock.mockResolvedValue(jsonResponse({ error: "Unexpected Error" }, 500));

		await expect(postLogin(credentials)).rejects.toThrow("HTTP error! status: 500");
	});
});

// ── What the forms show (real authService over real authApi) ─────────

describe("message reaching the register/login forms", () => {
	it("shows 'Email already in use' instead of a connection error on a duplicate signup", async () => {
		fetchMock.mockResolvedValue(jsonResponse({ error: "Email already in use" }, 409));

		await expect(registerUser(credentials)).rejects.toThrow("Email already in use");
	});

	it("still shows the server-problem message when registration hits a 5xx", async () => {
		fetchMock.mockResolvedValue(jsonResponse({ error: "Unexpected Error" }, 500));

		await expect(registerUser(credentials)).rejects.toThrow(
			"Failed to connect to server. Please try again later."
		);
	});

	it("shows the credential error for a rejected login", async () => {
		fetchMock.mockResolvedValue(jsonResponse({ error: "Invalid email or password." }, 401));

		await expect(loginUser(credentials)).rejects.toThrow("Invalid email or password.");
	});
});
