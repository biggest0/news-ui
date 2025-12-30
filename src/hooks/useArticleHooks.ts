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
	articlesLength: number; // Original articles length (for page calculation)
	filteredArticlesLength: number; // Filtered articles length (for showMore check)
	loadMoreArticles: (request: ArticleInfoQueryDTO) => void;
	selectedCategory: string;
	resetKey?: string;
}

export function useInfiniteScroll({
	articlesLength,
	filteredArticlesLength,
	loadMoreArticles,
	selectedCategory,
	resetKey,
}: UseInfiniteScrollProps) {
	const prevArticlesLength = useRef(0);
	const [page, setPage] = useState(1);
	const [showMore, setShowMore] = useState(true);
	const [fetching, setFetching] = useState(false);

	// Reset state when component mounts or resetKey changes
	useEffect(() => {
		prevArticlesLength.current = 0;
		setShowMore(true);
		setFetching(false);
	}, [resetKey]);

	// Check if more articles to load (based on filtered articles)
	useEffect(() => {
		if (filteredArticlesLength === prevArticlesLength.current) {
			setShowMore(false);
		} else {
			setShowMore(true);
			setFetching(false);
			prevArticlesLength.current = filteredArticlesLength;
		}
	}, [filteredArticlesLength]);

	// Update page count based on original articles length
	useEffect(() => {
		if (articlesLength > 0) {
			setPage(Math.ceil(articlesLength / 10));
		}
	}, [articlesLength]);

	// Lazy loading more articles
	useEffect(() => {
		const handleScroll = () => {
			if (
				!fetching &&
				showMore &&
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 700
			) {
				setFetching(true);
				setPage((prev) => prev + 1);
				loadMoreArticles({ page: page + 1, category: selectedCategory });
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, showMore, page, loadMoreArticles, selectedCategory]);

	const resetFilterState = () => {
		prevArticlesLength.current = 0;
	};

	return resetFilterState;
}
