/**
 * Unit tests for src/service/articleService.ts
 *
 * Each public function wraps an API call, maps DTOs through the article mapper,
 * and returns a safe fallback on failure. These tests mock the API layer to
 * verify the service's mapping, error-handling, and return-value contracts.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	getArticlesByCategory,
	getArticlesBySearch,
	getArticlesBySubCategory,
	getArticlesInfo,
	getArticleDetail,
	getTopTenArticles,
} from "@/service/articleService";
import type { ArticleInfoDTO, ArticleDetailDTO } from "@/types/articleDto";

// ── Mock the API layer ───────────────────────────────────────────────

vi.mock("@/api/articleApi", () => ({
	fetchArticlesByCategory: vi.fn(),
	fetchArticlesBySearch: vi.fn(),
	fetchArticlesBySubCategory: vi.fn(),
	fetchArticlesInfo: vi.fn(),
	fetchArticleDetail: vi.fn(),
	fetchTopTenArticles: vi.fn(),
}));

import {
	fetchArticlesByCategory,
	fetchArticlesBySearch,
	fetchArticlesBySubCategory,
	fetchArticlesInfo,
	fetchArticleDetail,
	fetchTopTenArticles,
} from "@/api/articleApi";

// ── Helpers ──────────────────────────────────────────────────────────

function makeDTOArticle(overrides: Partial<ArticleInfoDTO> = {}): ArticleInfoDTO {
	return {
		_id: "abc123",
		title: "Cat Parliament",
		summary: "A tabby took over",
		date_published: "2026-03-20T00:00:00.000Z",
		main_category: "politics",
		sub_category: ["government"],
		viewed: 100,
		like_count: 5,
		...overrides,
	};
}

function makeDTODetail(overrides: Partial<ArticleDetailDTO> = {}): ArticleDetailDTO {
	return {
		_id: "detail1",
		date_published: "2026-03-20T00:00:00.000Z",
		title: "Cat Parliament In Depth",
		summary: "Detailed investigation",
		paragraphs: ["Paragraph one.", "Paragraph two."],
		main_category: "politics",
		sub_category: ["government"],
		source: "Catire Press",
		url: "https://example.com/detail1",
		...overrides,
	};
}

beforeEach(() => {
	vi.resetAllMocks();
});

// ── getArticlesByCategory ────────────────────────────────────────────

describe("getArticlesByCategory", () => {
	it("maps DTOs and returns articles + count on success", async () => {
		vi.mocked(fetchArticlesByCategory).mockResolvedValue({
			articles: [makeDTOArticle()],
			count: 1,
		});

		const result = await getArticlesByCategory(1, "politics");

		expect(fetchArticlesByCategory).toHaveBeenCalledWith(1, "politics");
		expect(result.articles).toHaveLength(1);
		expect(result.articles[0].id).toBe("abc123");
		expect(result.articles[0].mainCategory).toBe("politics");
		expect(result.count).toBe(1);
	});

	it("returns empty fallback on API failure", async () => {
		vi.mocked(fetchArticlesByCategory).mockRejectedValue(new Error("Network error"));

		const result = await getArticlesByCategory(1, "politics");

		expect(result).toEqual({ articles: [], count: 0 });
	});
});

// ── getArticlesBySearch ──────────────────────────────────────────────

describe("getArticlesBySearch", () => {
	it("maps DTOs and returns articles + count on success", async () => {
		vi.mocked(fetchArticlesBySearch).mockResolvedValue({
			articles: [makeDTOArticle({ title: "Cat Search Result" })],
			count: 1,
		});

		const result = await getArticlesBySearch({ q: "cat", page: 1 });

		expect(fetchArticlesBySearch).toHaveBeenCalledWith({ q: "cat", page: 1, dateRange: undefined, sortBy: undefined });
		expect(result.articles[0].title).toBe("Cat Search Result");
	});

	it("returns empty fallback on API failure", async () => {
		vi.mocked(fetchArticlesBySearch).mockRejectedValue(new Error("500"));

		const result = await getArticlesBySearch({ q: "cat", page: 1 });

		expect(result).toEqual({ articles: [], count: 0 });
	});
});

// ── getArticlesBySubCategory ─────────────────────────────────────────

describe("getArticlesBySubCategory", () => {
	it("maps DTOs and returns articles + count on success", async () => {
		vi.mocked(fetchArticlesBySubCategory).mockResolvedValue({
			articles: [makeDTOArticle({ _id: "sub1" })],
			count: 1,
		});

		const result = await getArticlesBySubCategory(1, "government");

		expect(fetchArticlesBySubCategory).toHaveBeenCalledWith(1, "government");
		expect(result.articles[0].id).toBe("sub1");
	});

	it("returns empty fallback on API failure", async () => {
		vi.mocked(fetchArticlesBySubCategory).mockRejectedValue(new Error("fail"));

		const result = await getArticlesBySubCategory(1, "government");

		expect(result).toEqual({ articles: [], count: 0 });
	});
});

// ── getArticlesInfo ──────────────────────────────────────────────────

describe("getArticlesInfo", () => {
	it("passes the query DTO through and maps the response", async () => {
		vi.mocked(fetchArticlesInfo).mockResolvedValue({
			articles: [makeDTOArticle(), makeDTOArticle({ _id: "xyz" })],
			count: 2,
		});

		const query = { page: 2, limit: 5, category: "science" };
		const result = await getArticlesInfo(query);

		expect(fetchArticlesInfo).toHaveBeenCalledWith(query);
		expect(result.articles).toHaveLength(2);
		expect(result.count).toBe(2);
	});

	it("returns empty fallback on API failure", async () => {
		vi.mocked(fetchArticlesInfo).mockRejectedValue(new Error("timeout"));

		const result = await getArticlesInfo({ page: 1 });

		expect(result).toEqual({ articles: [], count: 0 });
	});
});

// ── getArticleDetail ─────────────────────────────────────────────────

describe("getArticleDetail", () => {
	it("maps the DTO detail into a domain ArticleDetail", async () => {
		vi.mocked(fetchArticleDetail).mockResolvedValue(makeDTODetail());

		const result = await getArticleDetail("detail1");

		expect(fetchArticleDetail).toHaveBeenCalledWith("detail1");
		expect(result.id).toBe("detail1");
		expect(result.title).toBe("Cat Parliament In Depth");
		expect(result.paragraphs).toEqual(["Paragraph one.", "Paragraph two."]);
		expect(result.source).toBe("Catire Press");
	});

	it("returns a safe error-state ArticleDetail on failure", async () => {
		vi.mocked(fetchArticleDetail).mockRejectedValue(new Error("404"));

		const result = await getArticleDetail("missing-id");

		expect(result.id).toBe("missing-id");
		expect(result.title).toBe("");
		expect(result.paragraphs).toEqual(["Error loading article details."]);
		expect(result.mainCategory).toBe("");
	});
});

// ── getTopTenArticles ────────────────────────────────────────────────

describe("getTopTenArticles", () => {
	it("maps an array of DTOs into domain ArticleInfo[]", async () => {
		vi.mocked(fetchTopTenArticles).mockResolvedValue([
			makeDTOArticle({ _id: "t1", viewed: 5000 }),
			makeDTOArticle({ _id: "t2", viewed: 4500 }),
		]);

		const result = await getTopTenArticles();

		expect(result).toHaveLength(2);
		expect(result![0].id).toBe("t1");
		expect(result![0].viewed).toBe(5000);
	});

	it("returns undefined on API failure", async () => {
		vi.mocked(fetchTopTenArticles).mockRejectedValue(new Error("down"));

		const result = await getTopTenArticles();

		expect(result).toBeUndefined();
	});
});
