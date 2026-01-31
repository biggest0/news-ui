import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/store/store";
import { loadArticlesBySubCategory } from "@/store/articlesSlice";

/**
 * Hook to load initial articles when subcategory changes
 * @param subCategory - Subcategory string
 */
export function useSubCategoryArticles(subCategory: string | undefined) {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (subCategory) {
			dispatch(loadArticlesBySubCategory({ page: 1, subCategory }));
		}
	}, [subCategory, dispatch]);
}

interface UseSubCategoryInfiniteScrollProps {
	currentArticlesCount: number; // Number of articles currently loaded
	totalArticlesCount: number; // Total articles available from server (count)
	subCategory: string | undefined;
}

/**
 * Hook to handle infinite scroll loading of articles by subcategory
 * Uses the count from API response to determine if more articles are available
 */
export function useSubCategoryInfiniteScroll({
	currentArticlesCount,
	totalArticlesCount,
	subCategory,
}: UseSubCategoryInfiniteScrollProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [page, setPage] = useState(1);
	const [fetching, setFetching] = useState(false);

	// Check if there are more articles to load based on server count
	const hasMore = currentArticlesCount < totalArticlesCount;

	// Reset page when subcategory changes
	useEffect(() => {
		setPage(1);
		setFetching(false);
	}, [subCategory]);

	// Update page count based on current articles loaded
	useEffect(() => {
		if (currentArticlesCount > 0) {
			setPage(Math.ceil(currentArticlesCount / 10));
		}
	}, [currentArticlesCount]);

	// Reset fetching state when new articles are loaded
	useEffect(() => {
		setFetching(false);
	}, [currentArticlesCount]);

	// Lazy loading more articles on scroll
	useEffect(() => {
		if (!subCategory) return;

		const handleScroll = () => {
			if (
				!fetching &&
				hasMore &&
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 700
			) {
				setFetching(true);
				const nextPage = page + 1;
				setPage(nextPage);
				dispatch(loadArticlesBySubCategory({ page: nextPage, subCategory }));
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, hasMore, page, subCategory, dispatch]);

	return { hasMore, page };
}
