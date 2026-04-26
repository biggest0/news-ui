import { useMemo } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";
import type { ArticleInfo } from "@/types/articleTypes";
import NewsCard from "@/components/news/cards/NewsCard";
import SearchSection from "@/components/search/SearchSection";
import {
	useSearchParams,
	useSearchArticles,
	useFilteredArticles,
	useSearchPagination,
	useInfiniteScroll,
} from "@/hooks/useSearchPage";
import type { SearchFilters } from "@/utils/search/searchUtils";

export default function SearchPage() {
	const { articles } = useSelector((state: RootState) => state.article);
	const { semanticSearch } = useSelector((state: RootState) => state.recommendations);
	const searchParams = useSearchParams();

	const isSemanticMode = searchParams.searchType === "semantic";

	// Load articles when query / searchType / filters change
	useSearchArticles(
		searchParams.query,
		searchParams.searchType,
		searchParams.dateRange,
		searchParams.sortBy
	);

	// Keyword path: filter + sort client-side
	const filters: SearchFilters = {
		query: searchParams.query,
		dateRange: searchParams.dateRange as SearchFilters["dateRange"],
		sortBy: searchParams.sortBy as SearchFilters["sortBy"],
	};
	const keywordArticles = useMemo(() => (isSemanticMode ? [] : articles), [isSemanticMode, articles]);
	const filteredArticles = useFilteredArticles(keywordArticles, filters);

	// Semantic path: map RecommendedArticle → ArticleInfo for NewsCard
	const semanticArticles: ArticleInfo[] = semanticSearch.articles.map((a) => ({
		id: a.id,
		title: a.title,
		summary: a.summary,
		datePublished: a.datePublished,
		mainCategory: a.mainCategory,
		subCategory: a.subCategory,
		viewed: 0,
		likeCount: 0,
	}));

	const articlesToDisplay = isSemanticMode ? semanticArticles : filteredArticles;

	// Pagination (shared for both modes)
	const { page, setPage, showMore, fetching, setFetching } = useSearchPagination(
		articlesToDisplay,
		filters
	);

	useInfiniteScroll(
		searchParams.query,
		searchParams.searchType,
		searchParams.dateRange,
		searchParams.sortBy,
		showMore,
		fetching,
		page,
		setPage,
		setFetching
	);

	return (
		<div>
			<SearchSection
				query={searchParams.query}
				dateRange={searchParams.dateRange}
				sortBy={searchParams.sortBy}
				searchType={searchParams.searchType}
			/>

			{searchParams.query && (
				<section>
					{articlesToDisplay.map((article) => (
						<NewsCard key={`search-${article.id}`} articleInfo={article} />
					))}
				</section>
			)}
		</div>
	);
}
