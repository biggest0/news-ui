import { useEffect, useRef, useState } from "react";
import type { ArticleInfo } from "@/types/articleTypes";
import type { ArticleInfoQueryDTO } from "@/types/articleDto";
import { useLocalStorage } from "./useLocalStorage";
import { USER_ARTICLE_HISTORY } from "@/constants/keys";
import { isWithinNDays } from "@/utils/date/dateUtils";

export function useArticleHistory() {
	const [articleHistory, setArticleHistory] = useLocalStorage<ArticleInfo[]>(
		USER_ARTICLE_HISTORY,
		[]
	);

	const handleLocalStorageUpdate = (clickedArticle: ArticleInfo) => {
		// Maintain a max of 100 articles in history
		if (articleHistory.length === 100) {
			articleHistory.pop();
		}
		// Check if article already exists in history
		if (!articleHistory.some((a) => a.id === clickedArticle.id)) {
			const updatedArticles = [clickedArticle, ...articleHistory];
			setArticleHistory(updatedArticles);
		} else {
			// Move the clicked article to the front
			const filteredArticles = articleHistory.filter(
				(a) => a.id !== clickedArticle.id
			);
			const updatedArticles = [clickedArticle, ...filteredArticles];
			setArticleHistory(updatedArticles);
		}
	};

	return handleLocalStorageUpdate;
}

export function useArticleFilters(articles: ArticleInfo[]) {
	const [articlesToDisplay, setArticlesToDisplay] = useState(articles);
	const [dateRange, setDateRange] = useState("all");
	const [sortBy, setSortBy] = useState("newest");

	// Filter articles when dateRange or sortBy changes
	useEffect(() => {
		let tempArticles = [...articles];

		if (dateRange) {
			switch (dateRange) {
				case "24h":
					tempArticles = tempArticles.filter((article) => {
						if (article.datePublished) {
							return isWithinNDays(article.datePublished, 1);
						}
					});
					break;
				case "7d":
					tempArticles = tempArticles.filter((article) => {
						if (article.datePublished) {
							return isWithinNDays(article.datePublished, 7);
						}
					});
					break;
				case "30d":
					tempArticles = tempArticles.filter((article) => {
						if (article.datePublished) {
							return isWithinNDays(article.datePublished, 30);
						}
					});
			}
		}

		if (sortBy) {
			switch (sortBy) {
				case "newest":
					tempArticles = tempArticles.sort((a, b) => {
						if (b.datePublished && a.datePublished) {
							return (
								new Date(b.datePublished).getTime() -
								new Date(a.datePublished).getTime()
							);
						}
						return 0;
					});
					break;
				case "mostViewed":
					tempArticles = tempArticles.sort((a, b) => {
						return (b.viewed || 0) - (a.viewed || 0);
					});
					break;
			}
		}

		// Compare tempArticles with articlesToDisplay before setting state
		setArticlesToDisplay((prevArticles) => {
			const currentIds = prevArticles.map((a) => a.id);
			const newIds = tempArticles.map((a) => a.id);

			let articlesAreDifferent = false;
			if (currentIds.length !== newIds.length) {
				articlesAreDifferent = true;
			} else {
				articlesAreDifferent = currentIds.some(
					(id, index) => id !== newIds[index]
				);
			}
			return articlesAreDifferent ? tempArticles : prevArticles;
		});
	}, [dateRange, sortBy, articles]);

	return {
		articlesToDisplay,
		dateRange,
		setDateRange,
		sortBy,
		setSortBy,
	};
}

interface UseInfiniteScrollProps {
	currentArticlesCount: number; // Number of articles currently loaded
	totalArticlesCount: number; // Total articles available from server
	loadMoreArticles: (request: ArticleInfoQueryDTO) => void;
	selectedCategory: string;
	resetKey?: string;
	enabled?: boolean; // Whether infinite scroll is active
	dateRange?: string;
	sortBy?: string;
}

export function useInfiniteScroll({
	currentArticlesCount,
	totalArticlesCount,
	loadMoreArticles,
	selectedCategory,
	resetKey,
	enabled = true,
	dateRange,
	sortBy,
}: UseInfiniteScrollProps) {
	const [page, setPage] = useState(1);
	const [fetching, setFetching] = useState(false);

	// Check if there are more articles to load
	const hasMore = currentArticlesCount < totalArticlesCount;

	// Reset page when resetKey changes
	useEffect(() => {
		setPage(1);
		setFetching(false);
	}, [resetKey]);

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
		if (!enabled) return;

		const handleScroll = () => {
			if (
				!fetching &&
				hasMore &&
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 700
			) {
				setFetching(true);
				const nextPage = page + 1;
				setPage(nextPage);
				loadMoreArticles({ page: nextPage, category: selectedCategory, dateRange, sortBy });
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, hasMore, page, loadMoreArticles, selectedCategory, enabled, dateRange, sortBy]);

	return { hasMore, page };
}
