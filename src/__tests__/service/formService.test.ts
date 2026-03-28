/**
 * Unit tests for src/service/formService.ts
 *
 * Tests the newsletter subscription service. Verifies that duplicate-email
 * detection, HTTP error wrapping, and non-Error exception handling all
 * produce the correct user-facing error messages.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { subscribeToNewsletter } from "@/service/formService";

// ── Mock the API layer ───────────────────────────────────────────────

vi.mock("@/api/formApi", () => ({
	postEmailSubscription: vi.fn(),
}));

import { postEmailSubscription } from "@/api/formApi";

beforeEach(() => {
	vi.resetAllMocks();
});

// ── subscribeToNewsletter ────────────────────────────────────────────

describe("subscribeToNewsletter", () => {
	it("resolves silently when the email is new (exists: false)", async () => {
		vi.mocked(postEmailSubscription).mockResolvedValue({
			message: { exists: false },
		});

		await expect(subscribeToNewsletter("new@example.com")).resolves.toBeUndefined();
		expect(postEmailSubscription).toHaveBeenCalledWith("new@example.com");
	});

	it("throws 'already subscribed' when the email exists", async () => {
		vi.mocked(postEmailSubscription).mockResolvedValue({
			message: { exists: true },
		});

		await expect(subscribeToNewsletter("old@example.com")).rejects.toThrow(
			"This email is already subscribed to our newsletter."
		);
	});

	it("throws user-friendly message on HTTP error", async () => {
		vi.mocked(postEmailSubscription).mockRejectedValue(
			new Error("HTTP error! status: 500")
		);

		await expect(subscribeToNewsletter("user@example.com")).rejects.toThrow(
			"Failed to connect to server. Please try again later."
		);
	});

	it("re-throws non-HTTP Error instances as-is", async () => {
		vi.mocked(postEmailSubscription).mockRejectedValue(
			new Error("Invalid email format")
		);

		await expect(subscribeToNewsletter("bad")).rejects.toThrow("Invalid email format");
	});

	it("throws generic connection message for non-Error exceptions", async () => {
		vi.mocked(postEmailSubscription).mockRejectedValue(null);

		await expect(subscribeToNewsletter("user@example.com")).rejects.toThrow(
			"Unable to subscribe. Please check your connection."
		);
	});
});
