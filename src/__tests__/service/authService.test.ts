/**
 * Unit tests for src/service/authService.ts
 *
 * Tests registration, login, token refresh, and logout flows.
 * The API layer is fully mocked so we only verify the service's
 * error-wrapping logic and pass-through behavior.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	registerUser,
	loginUser,
	refreshAccessToken,
	logoutUser,
} from "@/service/authService";
import type { AuthResponse, RefreshResponse } from "@/types/authTypes";

// ── Mock the API layer ───────────────────────────────────────────────

vi.mock("@/api/authApi", () => ({
	postRegister: vi.fn(),
	postLogin: vi.fn(),
	postRefreshToken: vi.fn(),
	postLogout: vi.fn(),
}));

import {
	postRegister,
	postLogin,
	postRefreshToken,
	postLogout,
} from "@/api/authApi";

// ── Helpers ──────────────────────────────────────────────────────────

const mockAuthResponse: AuthResponse = {
	user: { email: "cat@example.com" },
};

const mockRefreshResponse: RefreshResponse = {
	user: { email: "cat@example.com" },
};

beforeEach(() => {
	vi.resetAllMocks();
});

// ── registerUser ─────────────────────────────────────────────────────

describe("registerUser", () => {
	it("returns AuthResponse on successful registration", async () => {
		vi.mocked(postRegister).mockResolvedValue(mockAuthResponse);

		const result = await registerUser({ email: "cat@example.com", password: "meow123" });

		expect(postRegister).toHaveBeenCalledWith({ email: "cat@example.com", password: "meow123" });
		expect(result).toEqual(mockAuthResponse);
	});

	it("throws user-friendly message on HTTP error", async () => {
		vi.mocked(postRegister).mockRejectedValue(new Error("HTTP error! status: 500"));

		await expect(
			registerUser({ email: "cat@example.com", password: "meow123" })
		).rejects.toThrow("Failed to connect to server. Please try again later.");
	});

	it("re-throws server validation errors as-is (e.g. 'Email already exists')", async () => {
		vi.mocked(postRegister).mockRejectedValue(new Error("Email already exists"));

		await expect(
			registerUser({ email: "cat@example.com", password: "meow123" })
		).rejects.toThrow("Email already exists");
	});

	it("throws generic connection message for non-Error exceptions", async () => {
		vi.mocked(postRegister).mockRejectedValue(undefined);

		await expect(
			registerUser({ email: "cat@example.com", password: "meow123" })
		).rejects.toThrow("Unable to register. Please check your connection.");
	});
});

// ── loginUser ────────────────────────────────────────────────────────

describe("loginUser", () => {
	it("returns AuthResponse on successful login", async () => {
		vi.mocked(postLogin).mockResolvedValue(mockAuthResponse);

		const result = await loginUser({ email: "cat@example.com", password: "meow123" });

		expect(postLogin).toHaveBeenCalledWith({ email: "cat@example.com", password: "meow123" });
		expect(result).toEqual(mockAuthResponse);
	});

	it("throws invalid credentials message on 401", async () => {
		vi.mocked(postLogin).mockRejectedValue(new Error("HTTP error! status: 401"));

		await expect(
			loginUser({ email: "cat@example.com", password: "wrong" })
		).rejects.toThrow("Invalid email or password.");
	});

	it("throws user-friendly message on non-auth HTTP error", async () => {
		vi.mocked(postLogin).mockRejectedValue(new Error("HTTP error! status: 500"));

		await expect(
			loginUser({ email: "cat@example.com", password: "meow123" })
		).rejects.toThrow("Failed to connect to server. Please try again later.");
	});

	it("re-throws server auth errors as-is (e.g. 'Invalid credentials')", async () => {
		vi.mocked(postLogin).mockRejectedValue(new Error("Invalid credentials"));

		await expect(
			loginUser({ email: "cat@example.com", password: "wrong" })
		).rejects.toThrow("Invalid credentials");
	});

	it("throws generic connection message for non-Error exceptions", async () => {
		vi.mocked(postLogin).mockRejectedValue(null);

		await expect(
			loginUser({ email: "cat@example.com", password: "meow123" })
		).rejects.toThrow("Unable to log in. Please check your connection.");
	});
});

// ── refreshAccessToken ───────────────────────────────────────────────

describe("refreshAccessToken", () => {
	it("returns user info on success", async () => {
		vi.mocked(postRefreshToken).mockResolvedValue(mockRefreshResponse);

		const result = await refreshAccessToken();

		expect(postRefreshToken).toHaveBeenCalled();
		expect(result).toEqual(mockRefreshResponse);
	});

	it("propagates errors directly (no wrapping — caller handles)", async () => {
		vi.mocked(postRefreshToken).mockRejectedValue(new Error("HTTP error! status: 401"));

		await expect(refreshAccessToken()).rejects.toThrow(
			"HTTP error! status: 401"
		);
	});
});

// ── logoutUser ───────────────────────────────────────────────────────

describe("logoutUser", () => {
	it("resolves silently on success", async () => {
		vi.mocked(postLogout).mockResolvedValue(undefined);

		await expect(logoutUser()).resolves.toBeUndefined();
		expect(postLogout).toHaveBeenCalled();
	});

	it("throws user-friendly message on HTTP error", async () => {
		vi.mocked(postLogout).mockRejectedValue(new Error("HTTP error! status: 500"));

		await expect(logoutUser()).rejects.toThrow(
			"Failed to connect to server. Please try again later."
		);
	});

	it("re-throws non-HTTP Error instances as-is", async () => {
		vi.mocked(postLogout).mockRejectedValue(new Error("Session not found"));

		await expect(logoutUser()).rejects.toThrow(
			"Session not found"
		);
	});

	it("throws generic connection message for non-Error exceptions", async () => {
		vi.mocked(postLogout).mockRejectedValue("string error");

		await expect(logoutUser()).rejects.toThrow(
			"Unable to log out. Please check your connection."
		);
	});
});
