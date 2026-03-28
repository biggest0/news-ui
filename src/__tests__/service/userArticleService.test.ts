/**
 * Unit tests for src/service/userArticleService.ts
 *
 * Tests the authenticated user–article interactions: like toggling, like status
 * fetching, reading history CRUD, and the fire-and-forget read recording.
 * All API calls are mocked to isolate service-layer error handling and mapping.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	toggleArticleLike,
	getArticleLikeStatus,
	recordArticleRead,
	getArticleHistory,
	clearArticleHistory,
	removeArticleFromHistory,
} from "@/service/userArticleService";

// ── Mock the API layer ───────────────────────────────────────────────

vi.mock("@/api/userArticleApi", () => ({
	postToggleLike: vi.fn(),
	fetchLikeStatus: vi.fn(),
	postArticleRead: vi.fn(),
	fetchArticleHistory: vi.fn(),
	deleteArticleHistory: vi.fn(),
	deleteArticleHistoryItem: vi.fn(),
}));

import {
	postToggleLike,
	fetchLikeStatus,
	postArticleRead,
	fetchArticleHistory,
	deleteArticleHistory,
	deleteArticleHistoryItem,
} from "@/api/userArticleApi";

const TOKEN = "test-access-token";

beforeEach(() => {
	vi.resetAllMocks();
});

// ── toggleArticleLike ────────────────────────────────────────────────

describe("toggleArticleLike", () => {
	it("returns mapped like status on success", async () => {
		vi.mocked(postToggleLike).mockResolvedValue({ liked: true, like_count: 42 });

		const result = await toggleArticleLike("art1", TOKEN);

		expect(postToggleLike).toHaveBeenCalledWith("art1", TOKEN);
		expect(result).toEqual({ liked: true, likeCount: 42 });
	});

	it("throws user-friendly message on HTTP error", async () => {
		vi.mocked(postToggleLike).mockRejectedValue(new Error("HTTP error! status: 500"));

		await expect(toggleArticleLike("art1", TOKEN)).rejects.toThrow(
			"Failed to connect to server. Please try again later."
		);
	});

	it("re-throws non-HTTP Error instances as-is", async () => {
		vi.mocked(postToggleLike).mockRejectedValue(new Error("Token expired"));

		await expect(toggleArticleLike("art1", TOKEN)).rejects.toThrow("Token expired");
	});

	it("throws generic connection message for non-Error exceptions", async () => {
		vi.mocked(postToggleLike).mockRejectedValue("string error");

		await expect(toggleArticleLike("art1", TOKEN)).rejects.toThrow(
			"Unable to update like. Please check your connection."
		);
	});
});

// ── getArticleLikeStatus ─────────────────────────────────────────────

describe("getArticleLikeStatus", () => {
	it("returns mapped like status on success", async () => {
		vi.mocked(fetchLikeStatus).mockResolvedValue({ liked: false, like_count: 10 });

		const result = await getArticleLikeStatus("art1", TOKEN);

		expect(fetchLikeStatus).toHaveBeenCalledWith("art1", TOKEN);
		expect(result).toEqual({ liked: false, likeCount: 10 });
	});

	it("returns safe defaults on failure instead of throwing", async () => {
		vi.mocked(fetchLikeStatus).mockRejectedValue(new Error("network"));

		const result = await getArticleLikeStatus("art1", TOKEN);

		expect(result).toEqual({ liked: false, likeCount: 0 });
	});

	it("works without accessToken (unauthenticated)", async () => {
		vi.mocked(fetchLikeStatus).mockResolvedValue({ liked: false, like_count: 7 });

		const result = await getArticleLikeStatus("art1");

		expect(fetchLikeStatus).toHaveBeenCalledWith("art1", undefined);
		expect(result).toEqual({ liked: false, likeCount: 7 });
	});

	it("works with null accessToken", async () => {
		vi.mocked(fetchLikeStatus).mockResolvedValue({ liked: false, like_count: 3 });

		const result = await getArticleLikeStatus("art1", null);

		expect(fetchLikeStatus).toHaveBeenCalledWith("art1", null);
		expect(result).toEqual({ liked: false, likeCount: 3 });
	});
});

// ── recordArticleRead ────────────────────────────────────────────────

describe("recordArticleRead", () => {
	it("delegates to postArticleRead (fire-and-forget)", () => {
		recordArticleRead("art1", TOKEN);

		expect(postArticleRead).toHaveBeenCalledWith("art1", TOKEN);
	});

	it("does not return a value", () => {
		const result = recordArticleRead("art1", TOKEN);

		expect(result).toBeUndefined();
	});
});

// ── getArticleHistory ────────────────────────────────────────────────

describe("getArticleHistory", () => {
	it("maps DTO history items and returns articles + count", async () => {
		vi.mocked(fetchArticleHistory).mockResolvedValue({
			articles: [
				{
					_id: "h1",
					title: "History Article",
					summary: "Summary",
					date_published: "2026-03-20T00:00:00.000Z",
					main_category: "politics",
					sub_category: ["government"],
					viewed: 50,
					like_count: 3,
					read_at: "2026-03-24T14:30:00.000Z",
				},
			],
			count: 1,
		});

		const result = await getArticleHistory(TOKEN, 1, 20);

		expect(fetchArticleHistory).toHaveBeenCalledWith(TOKEN, 1, 20);
		expect(result.articles).toHaveLength(1);
		expect(result.articles[0].id).toBe("h1");
		expect(result.articles[0].readAt).toBeTruthy();
		expect(result.count).toBe(1);
	});

	it("uses default page=1 and limit=20", async () => {
		vi.mocked(fetchArticleHistory).mockResolvedValue({ articles: [], count: 0 });

		await getArticleHistory(TOKEN);

		expect(fetchArticleHistory).toHaveBeenCalledWith(TOKEN, 1, 20);
	});

	it("returns empty fallback on failure", async () => {
		vi.mocked(fetchArticleHistory).mockRejectedValue(new Error("401"));

		const result = await getArticleHistory(TOKEN);

		expect(result).toEqual({ articles: [], count: 0 });
	});
});

// ── clearArticleHistory ──────────────────────────────────────────────

describe("clearArticleHistory", () => {
	it("resolves silently on success", async () => {
		vi.mocked(deleteArticleHistory).mockResolvedValue(undefined);

		await expect(clearArticleHistory(TOKEN)).resolves.toBeUndefined();
		expect(deleteArticleHistory).toHaveBeenCalledWith(TOKEN);
	});

	it("throws user-friendly message on HTTP error", async () => {
		vi.mocked(deleteArticleHistory).mockRejectedValue(new Error("HTTP error! status: 500"));

		await expect(clearArticleHistory(TOKEN)).rejects.toThrow(
			"Failed to connect to server. Please try again later."
		);
	});

	it("re-throws non-HTTP Error instances as-is", async () => {
		vi.mocked(deleteArticleHistory).mockRejectedValue(new Error("Unauthorized"));

		await expect(clearArticleHistory(TOKEN)).rejects.toThrow("Unauthorized");
	});

	it("throws generic connection message for non-Error exceptions", async () => {
		vi.mocked(deleteArticleHistory).mockRejectedValue(42);

		await expect(clearArticleHistory(TOKEN)).rejects.toThrow(
			"Unable to clear history. Please check your connection."
		);
	});
});

// ── removeArticleFromHistory ─────────────────────────────────────────

describe("removeArticleFromHistory", () => {
	it("resolves silently on success", async () => {
		vi.mocked(deleteArticleHistoryItem).mockResolvedValue(undefined);

		await expect(removeArticleFromHistory("art1", TOKEN)).resolves.toBeUndefined();
		expect(deleteArticleHistoryItem).toHaveBeenCalledWith("art1", TOKEN);
	});

	it("throws user-friendly message on HTTP error", async () => {
		vi.mocked(deleteArticleHistoryItem).mockRejectedValue(
			new Error("HTTP error! status: 404")
		);

		await expect(removeArticleFromHistory("art1", TOKEN)).rejects.toThrow(
			"Failed to connect to server. Please try again later."
		);
	});

	it("re-throws non-HTTP Error instances as-is", async () => {
		vi.mocked(deleteArticleHistoryItem).mockRejectedValue(new Error("Forbidden"));

		await expect(removeArticleFromHistory("art1", TOKEN)).rejects.toThrow("Forbidden");
	});

	it("throws generic connection message for non-Error exceptions", async () => {
		vi.mocked(deleteArticleHistoryItem).mockRejectedValue(null);

		await expect(removeArticleFromHistory("art1", TOKEN)).rejects.toThrow(
			"Unable to remove article from history. Please check your connection."
		);
	});
});
