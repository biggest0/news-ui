import { describe, it, expect } from "vitest";
import {
	parseSearchParams,
	buildSearchParams,
	buildSearchUrl,
} from "@/utils/search/searchUrlUtils";

// ── parseSearchParams ────────────────────────────────────────────────

describe("parseSearchParams", () => {
	it("parses all three params from a full query string", () => {
		const result = parseSearchParams("?q=cat&dateRange=7d&sortBy=newest");
		expect(result).toEqual({
			query: "cat",
			dateRange: "7d",
			sortBy: "newest",
			searchType: "keyword",
		});
	});

	it("defaults dateRange to 'all' and sortBy to 'newest' when missing", () => {
		const result = parseSearchParams("?q=dog");
		expect(result).toEqual({
			query: "dog",
			dateRange: "all",
			sortBy: "newest",
			searchType: "keyword",
		});
	});

	it("defaults query to empty string when missing", () => {
		const result = parseSearchParams("?dateRange=30d");
		expect(result.query).toBe("");
	});

	it("handles empty search string", () => {
		const result = parseSearchParams("");
		expect(result).toEqual({
			query: "",
			dateRange: "all",
			sortBy: "newest",
			searchType: "keyword",
		});
	});

	it("handles URL-encoded query values", () => {
		const result = parseSearchParams("?q=hello%20world&dateRange=24h&sortBy=relevant");
		expect(result.query).toBe("hello world");
	});

	it("handles special characters in query", () => {
		const result = parseSearchParams("?q=cat%26dog");
		expect(result.query).toBe("cat&dog");
	});
});

// ── buildSearchParams ────────────────────────────────────────────────

describe("buildSearchParams", () => {
	it("builds query string from all params", () => {
		const result = buildSearchParams({ query: "cat", dateRange: "7d", sortBy: "newest" });
		expect(result).toContain("q=cat");
		expect(result).toContain("dateRange=7d");
		expect(result).toContain("sortBy=newest");
	});

	it("omits empty query", () => {
		const result = buildSearchParams({ query: "", dateRange: "7d" });
		expect(result).not.toContain("q=");
		expect(result).toContain("dateRange=7d");
	});

	it("omits empty dateRange", () => {
		const result = buildSearchParams({ query: "cat", dateRange: "" });
		expect(result).toContain("q=cat");
		expect(result).not.toContain("dateRange");
	});

	it("returns empty string when all params are empty", () => {
		const result = buildSearchParams({ query: "", dateRange: "", sortBy: "" });
		expect(result).toBe("");
	});

	it("returns empty string when called with empty object", () => {
		const result = buildSearchParams({});
		expect(result).toBe("");
	});

	it("encodes special characters in query", () => {
		const result = buildSearchParams({ query: "hello world" });
		expect(result).toContain("q=hello+world");
	});
});

// ── buildSearchUrl ───────────────────────────────────────────────────

describe("buildSearchUrl", () => {
	it("returns /search with query string", () => {
		const result = buildSearchUrl({ query: "cat", dateRange: "7d", sortBy: "newest" });
		expect(result).toMatch(/^\/search\?/);
		expect(result).toContain("q=cat");
	});

	it("returns /search without ? when no params have values", () => {
		const result = buildSearchUrl({});
		expect(result).toBe("/search");
	});

	it("returns /search without ? when all params empty", () => {
		const result = buildSearchUrl({ query: "", dateRange: "", sortBy: "" });
		expect(result).toBe("/search");
	});
});

// ── Round-trip ───────────────────────────────────────────────────────

describe("round-trip: build → parse", () => {
	it("preserves params through buildSearchParams → parseSearchParams", () => {
		const original = { query: "cat facts", dateRange: "30d", sortBy: "relevant" };
		const queryString = buildSearchParams(original);
		const parsed = parseSearchParams(`?${queryString}`);
		expect(parsed.query).toBe("cat facts");
		expect(parsed.dateRange).toBe("30d");
		expect(parsed.sortBy).toBe("relevant");
	});
});
