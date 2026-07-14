/**
 * Store-level integration tests for the RTK Query endpoints (M7).
 *
 * Dispatches real endpoint initiators against a real store with global fetch
 * stubbed, verifying:
 * - URL construction (incl. the F015 regression: special characters in
 *   category/subCategory survive as percent-encoded query params)
 * - transformResponse mapping (DTO → domain; components never see DTOs)
 * - the uniform error surface (isError, no throw)
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "@/store/api/apiSlice";
import { articleEndpoints } from "@/store/api/articleEndpoints";
import { catFactEndpoints } from "@/store/api/catFactEndpoints";
import { userContentEndpoints } from "@/store/api/userContentEndpoints";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

/** Builds a Response-like object for the fetch stub. */
function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

function makeStore() {
	return configureStore({
		reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
		middleware: (gdm) => gdm().concat(apiSlice.middleware),
	});
}

const dtoArticle = {
	_id: "a1",
	title: "Cat Wins Election",
	summary: "A landslide.",
	date_published: "2026-03-27T10:00:00.000Z",
	main_category: "politics",
	sub_category: ["government"],
	viewed: 10,
	like_count: 2,
};

beforeEach(() => {
	fetchMock.mockReset();
});

describe("getArticlesPage URL construction (F015 regression)", () => {
	it("percent-encodes sub-categories containing spaces and ampersands", async () => {
		fetchMock.mockResolvedValue(jsonResponse({ articles: [], count: 0 }));
		const store = makeStore();

		await store.dispatch(
			articleEndpoints.endpoints.getArticlesPage.initiate({
				page: 1,
				limit: 10,
				subCategory: "Food & drink industry",
				lang: "en",
			})
		);

		const calledUrl = new URL(fetchMock.mock.calls[0][0].url);
		expect(calledUrl.pathname).toBe("/api/articles");
		// the & must not have split the query string
		expect(calledUrl.searchParams.get("subCategory")).toBe(
			"Food & drink industry"
		);
		expect([...calledUrl.searchParams.keys()].sort()).toEqual([
			"lang",
			"limit",
			"page",
			"subCategory",
		]);
	});
});

describe("transformResponse mapping (DTO → domain)", () => {
	it("maps article DTOs to camelCase domain articles", async () => {
		fetchMock.mockResolvedValue(
			jsonResponse({ articles: [dtoArticle], count: 1 })
		);
		const store = makeStore();

		const result = await store.dispatch(
			articleEndpoints.endpoints.getArticlesPage.initiate({
				page: 1,
				limit: 10,
				lang: "en",
			})
		);

		expect(result.data?.articles[0]).toMatchObject({
			id: "a1",
			title: "Cat Wins Election",
			mainCategory: "politics",
			likeCount: 2,
		});
		// no snake_case DTO fields leak into the domain object
		expect(result.data?.articles[0]).not.toHaveProperty("main_category");
	});

	it("maps cat fact DTOs and puts lang in the cache key", async () => {
		fetchMock.mockResolvedValue(
			jsonResponse({ facts: [{ _id: "f1", title: "T", fact: "F" }] })
		);
		const store = makeStore();

		const result = await store.dispatch(
			catFactEndpoints.endpoints.getCatFacts.initiate({ lang: "fr" })
		);

		expect(result.data).toEqual([{ id: "f1", title: "T", fact: "F" }]);
		expect(fetchMock.mock.calls[0][0].url).toContain("lang=fr");
	});

	it("maps like-status snake_case to domain shape", async () => {
		fetchMock.mockResolvedValue(jsonResponse({ liked: true, like_count: 7 }));
		const store = makeStore();

		const result = await store.dispatch(
			userContentEndpoints.endpoints.getLikeStatus.initiate({
				articleId: "a1",
			})
		);

		expect(result.data).toEqual({ liked: true, likeCount: 7 });
	});
});

describe("error surface", () => {
	it("exposes isError instead of throwing on server failure", async () => {
		fetchMock.mockResolvedValue(jsonResponse({ message: "boom" }, 500));
		const store = makeStore();

		const result = await store.dispatch(
			articleEndpoints.endpoints.getTopTen.initiate({ lang: "en" })
		);

		expect(result.isError).toBe(true);
		expect(result.data).toBeUndefined();
	});
});
