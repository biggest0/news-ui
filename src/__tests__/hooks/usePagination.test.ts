/**
 * Unit tests for usePagination (M7).
 *
 * The RTK Query hook is mocked so we can drive `data`/loading/error and
 * verify the derived state usePagination owns: totalPages math,
 * hasNext/hasPrev, page-number clamping in goToPage, and page reset when
 * filters change.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { usePagination } from "@/hooks/usePagination";

vi.mock("@/hooks/useApiLang", () => ({ useApiLang: () => "en" }));

const queryResult = {
	data: { articles: [], count: 0 } as { articles: unknown[]; count: number },
	isFetching: false,
	isError: false,
	refetch: vi.fn(),
};

vi.mock("@/store/api/articleEndpoints", () => ({
	useGetArticlesPageQuery: () => queryResult,
}));

beforeEach(() => {
	queryResult.data = { articles: [], count: 0 };
	queryResult.isFetching = false;
	queryResult.isError = false;
});

describe("usePagination", () => {
	it("computes totalPages from the server count and page size", () => {
		queryResult.data = { articles: [1, 2, 3], count: 23 };
		const { result } = renderHook(() =>
			usePagination({ selectedCategory: "", initialPageSize: 5 })
		);

		// ceil(23 / 5) = 5
		expect(result.current.totalPages).toBe(5);
		expect(result.current.totalCount).toBe(23);
		expect(result.current.hasPrevPage).toBe(false);
		expect(result.current.hasNextPage).toBe(true);
	});

	it("clamps goToPage within the valid range", () => {
		queryResult.data = { articles: [], count: 23 }; // 5 pages
		const { result } = renderHook(() =>
			usePagination({ selectedCategory: "", initialPageSize: 5 })
		);

		act(() => result.current.goToPage(99));
		expect(result.current.currentPage).toBe(5);

		act(() => result.current.goToPage(-3));
		expect(result.current.currentPage).toBe(1);

		act(() => result.current.goToPage(3));
		expect(result.current.currentPage).toBe(3);
		expect(result.current.hasPrevPage).toBe(true);
		expect(result.current.hasNextPage).toBe(true);
	});

	it("always reports at least one page even with no results", () => {
		queryResult.data = { articles: [], count: 0 };
		const { result } = renderHook(() =>
			usePagination({ selectedCategory: "", initialPageSize: 10 })
		);

		expect(result.current.totalPages).toBe(1);
		expect(result.current.hasNextPage).toBe(false);
	});

	it("resets to page 1 when the category changes", () => {
		queryResult.data = { articles: [], count: 100 };
		const { result, rerender } = renderHook(
			({ category }) => usePagination({ selectedCategory: category }),
			{ initialProps: { category: "science" } }
		);

		act(() => result.current.goToPage(4));
		expect(result.current.currentPage).toBe(4);

		rerender({ category: "politics" });
		expect(result.current.currentPage).toBe(1);
	});

	it("surfaces the query's loading and error flags", () => {
		queryResult.isFetching = true;
		queryResult.isError = true;
		const { result } = renderHook(() =>
			usePagination({ selectedCategory: "" })
		);

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(true);
	});
});
