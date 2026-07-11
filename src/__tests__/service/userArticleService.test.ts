/**
 * Unit tests for src/service/userArticleService.ts
 *
 * M5 note: like toggling, like status, and reading-history CRUD moved to
 * RTK Query endpoints (store/api/userContentEndpoints.ts) and are covered by
 * endpoint tests. Only the fire-and-forget read recording remains here.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { recordArticleRead } from "@/service/userArticleService";

// ── Mock the API layer ───────────────────────────────────────────────

vi.mock("@/api/userArticleApi", () => ({
	postArticleRead: vi.fn(),
}));

import { postArticleRead } from "@/api/userArticleApi";

beforeEach(() => {
	vi.resetAllMocks();
});

describe("recordArticleRead", () => {
	it("posts the read event without awaiting the result (fire-and-forget)", () => {
		const result = recordArticleRead("a1");

		expect(postArticleRead).toHaveBeenCalledWith("a1");
		// intentionally returns nothing — callers must not await it
		expect(result).toBeUndefined();
	});
});
