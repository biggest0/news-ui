/**
 * Tests for the raw api layer's URL construction.
 *
 * Regression coverage for F015: fetchArticlesByCategory and
 * fetchArticlesBySubCategory used raw string interpolation, so values
 * containing spaces or "&" (e.g. the real sub-category "Food & drink
 * industry") truncated the query string. Both must percent-encode via
 * URLSearchParams like every other endpoint.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	fetchArticlesByCategory,
	fetchArticlesBySubCategory,
} from "@/api/articleApi";

// Stub global fetch and capture the URL each call is made with
const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

/** Returns the URL string of the most recent fetch call. */
function lastFetchedUrl(): string {
	return fetchMock.mock.calls[fetchMock.mock.calls.length - 1][0] as string;
}

beforeEach(() => {
	fetchMock.mockReset();
	fetchMock.mockResolvedValue({
		ok: true,
		json: () => Promise.resolve({ articles: [], count: 0 }),
	});
});

describe("fetchArticlesByCategory URL encoding (F015)", () => {
	it("percent-encodes special characters in the category value", async () => {
		await fetchArticlesByCategory(2, "science & tech");

		const url = new URL(lastFetchedUrl());
		// the raw "&" must not split the query string
		expect(url.searchParams.get("category")).toBe("science & tech");
		expect(url.searchParams.get("page")).toBe("2");
		expect(url.searchParams.get("limit")).toBe("10");
		expect(url.searchParams.get("lang")).toBeTruthy();
	});
});

describe("fetchArticlesBySubCategory URL encoding (F015)", () => {
	it("survives a real-world sub-category containing spaces and ampersand", async () => {
		await fetchArticlesBySubCategory(1, "Food & drink industry");

		const url = new URL(lastFetchedUrl());
		expect(url.searchParams.get("subCategory")).toBe("Food & drink industry");
		// the ampersand must not have injected a bogus empty param
		expect([...url.searchParams.keys()]).toEqual([
			"page",
			"limit",
			"subCategory",
			"lang",
		]);
	});
});
