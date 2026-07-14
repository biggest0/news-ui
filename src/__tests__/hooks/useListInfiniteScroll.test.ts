/**
 * Unit tests for the RTK Query infinite-scroll driver (M7).
 * Verifies threshold behavior, in-flight suppression, and enable gating.
 */
import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useListInfiniteScroll } from "@/hooks/useArticleHooks";

function fireScrollAt(scrollY: number, scrollHeight: number, innerHeight = 800) {
	Object.defineProperty(window, "innerHeight", { value: innerHeight, configurable: true });
	Object.defineProperty(window, "scrollY", { value: scrollY, configurable: true });
	Object.defineProperty(document.body, "scrollHeight", {
		value: scrollHeight,
		configurable: true,
	});
	window.dispatchEvent(new Event("scroll"));
}

describe("useListInfiniteScroll", () => {
	it("fetches the next page when scrolled within the 700px threshold", () => {
		const fetchNextPage = vi.fn();
		renderHook(() =>
			useListInfiniteScroll({
				enabled: true,
				hasNextPage: true,
				isFetching: false,
				fetchNextPage,
			})
		);

		fireScrollAt(1600, 3000); // 800 + 1600 = 2400 >= 3000 - 700
		expect(fetchNextPage).toHaveBeenCalledTimes(1);
	});

	it("does nothing while a page request is in flight", () => {
		const fetchNextPage = vi.fn();
		renderHook(() =>
			useListInfiniteScroll({
				enabled: true,
				hasNextPage: true,
				isFetching: true,
				fetchNextPage,
			})
		);

		fireScrollAt(1600, 3000);
		expect(fetchNextPage).not.toHaveBeenCalled();
	});

	it("does nothing when there is no next page", () => {
		const fetchNextPage = vi.fn();
		renderHook(() =>
			useListInfiniteScroll({
				enabled: true,
				hasNextPage: false,
				isFetching: false,
				fetchNextPage,
			})
		);

		fireScrollAt(1600, 3000);
		expect(fetchNextPage).not.toHaveBeenCalled();
	});

	it("does nothing when disabled (page-pagination mode)", () => {
		const fetchNextPage = vi.fn();
		renderHook(() =>
			useListInfiniteScroll({
				enabled: false,
				hasNextPage: true,
				isFetching: false,
				fetchNextPage,
			})
		);

		fireScrollAt(1600, 3000);
		expect(fetchNextPage).not.toHaveBeenCalled();
	});

	it("stays quiet above the threshold", () => {
		const fetchNextPage = vi.fn();
		renderHook(() =>
			useListInfiniteScroll({
				enabled: true,
				hasNextPage: true,
				isFetching: false,
				fetchNextPage,
			})
		);

		fireScrollAt(100, 3000); // 900 < 2300
		expect(fetchNextPage).not.toHaveBeenCalled();
	});
});
