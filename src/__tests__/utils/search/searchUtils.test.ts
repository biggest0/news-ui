import { describe, it, expect, vi, afterEach } from "vitest";
import { filterAndSortArticles } from "@/utils/search/searchUtils";
import type { SearchFilters } from "@/utils/search/searchUtils";
import type { ArticleInfo } from "@/types/articleTypes";

// ── Helpers ──────────────────────────────────────────────────────────

function makeArticle(overrides: Partial<ArticleInfo> = {}): ArticleInfo {
	return {
		id: "1",
		title: "Cat Parliament",
		summary: "A tabby named Lord Whiskers took over parliament",
		datePublished: "3/20/2026",
		mainCategory: "politics",
		subCategory: ["government"],
		viewed: 100,
		likeCount: 5,
		...overrides,
	};
}

const sampleArticles: ArticleInfo[] = [
	makeArticle({
		id: "1",
		title: "Cat Parliament",
		summary: "A tabby named Lord Whiskers took over parliament",
		datePublished: "3/20/2026",
		viewed: 100,
	}),
	makeArticle({
		id: "2",
		title: "Dog Park Revolution",
		summary: "Dogs unite against leash laws",
		datePublished: "3/25/2026",
		viewed: 500,
	}),
	makeArticle({
		id: "3",
		title: "Cat Cafe Opens Downtown",
		summary: "A new cat cafe with 50 rescue cats",
		datePublished: "3/26/2026",
		viewed: 250,
	}),
];

// ── filterAndSortArticles ────────────────────────────────────────────

describe("filterAndSortArticles", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns empty array when query is empty", () => {
		const filters: SearchFilters = { query: "", dateRange: "all", sortBy: "newest" };
		expect(filterAndSortArticles(sampleArticles, filters)).toEqual([]);
	});

	it("returns empty array when query is whitespace", () => {
		const filters: SearchFilters = { query: "   ", dateRange: "all", sortBy: "newest" };
		expect(filterAndSortArticles(sampleArticles, filters)).toEqual([]);
	});

	it("filters articles by query matching title", () => {
		const filters: SearchFilters = { query: "cat", dateRange: "all", sortBy: "" };
		const result = filterAndSortArticles(sampleArticles, filters);
		expect(result).toHaveLength(2);
		expect(result.map((a) => a.id)).toContain("1");
		expect(result.map((a) => a.id)).toContain("3");
	});

	it("filters articles by query matching summary", () => {
		const filters: SearchFilters = { query: "leash", dateRange: "all", sortBy: "" };
		const result = filterAndSortArticles(sampleArticles, filters);
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe("2");
	});

	it("query matching is case-insensitive", () => {
		const filters: SearchFilters = { query: "CAT", dateRange: "all", sortBy: "" };
		const result = filterAndSortArticles(sampleArticles, filters);
		expect(result).toHaveLength(2);
	});

	it("filters by date range '7d'", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-03-27T12:00:00.000Z"));

		const filters: SearchFilters = { query: "cat", dateRange: "7d", sortBy: "" };
		const result = filterAndSortArticles(sampleArticles, filters);
		// Cat Parliament (3/20) is 7 days ago → included (boundary)
		// Cat Cafe (3/26) is 1 day ago → included
		expect(result).toHaveLength(2);
	});

	it("filters by date range '24h'", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-03-27T12:00:00.000Z"));

		const filters: SearchFilters = { query: "cat", dateRange: "24h", sortBy: "" };
		const result = filterAndSortArticles(sampleArticles, filters);
		// Only Cat Cafe (3/26) is within 1 day
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe("3");
	});

	it("sorts by 'newest' — most recent first", () => {
		const filters: SearchFilters = { query: "cat", dateRange: "all", sortBy: "newest" };
		const result = filterAndSortArticles(sampleArticles, filters);
		expect(result[0].id).toBe("3"); // 3/26
		expect(result[1].id).toBe("1"); // 3/20
	});

	it("sorts by 'relevant' — highest match count first", () => {
		const articles = [
			makeArticle({ id: "a", title: "Cat", summary: "No match here" }),
			makeArticle({ id: "b", title: "Cat cat cat", summary: "The cat is great" }),
		];
		const filters: SearchFilters = { query: "cat", dateRange: "all", sortBy: "relevant" };
		const result = filterAndSortArticles(articles, filters);
		// "b" has more "cat" matches (3 in title ×2 + 1 in summary = 7) vs "a" (1×2 = 2)
		expect(result[0].id).toBe("b");
	});

	it("returns no matches when query doesn't match any article", () => {
		const filters: SearchFilters = { query: "zebra", dateRange: "all", sortBy: "" };
		const result = filterAndSortArticles(sampleArticles, filters);
		expect(result).toEqual([]);
	});

	it("handles dateRange 'all' and empty string the same — no filtering", () => {
		const filtersAll: SearchFilters = { query: "cat", dateRange: "all", sortBy: "" };
		const filtersEmpty: SearchFilters = { query: "cat", dateRange: "", sortBy: "" };
		const resultAll = filterAndSortArticles(sampleArticles, filtersAll);
		const resultEmpty = filterAndSortArticles(sampleArticles, filtersEmpty);
		expect(resultAll).toEqual(resultEmpty);
	});

	it("handles articles with undefined summary", () => {
		const articles = [makeArticle({ id: "x", title: "Cat story", summary: undefined })];
		const filters: SearchFilters = { query: "cat", dateRange: "all", sortBy: "" };
		const result = filterAndSortArticles(articles, filters);
		expect(result).toHaveLength(1);
	});

	it("handles empty articles array", () => {
		const filters: SearchFilters = { query: "cat", dateRange: "all", sortBy: "" };
		const result = filterAndSortArticles([], filters);
		expect(result).toEqual([]);
	});
});
