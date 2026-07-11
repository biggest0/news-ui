import NewsCard from "@/components/news/cards/NewsCard";
import SearchSection from "@/components/search/SearchSection";
import { SectionErrorMessage } from "@/components/common/feedback/SectionErrorMessage";
import {
	useSearchParams,
	useSearchResults,
	useFilteredArticles,
	useSearchInfiniteScroll,
} from "@/hooks/useSearchPage";
import type { SearchFilters } from "@/utils/search/searchUtils";

/**
 * Search results page — RTK Query consumer. Keyword and semantic modes are
 * separate infinite queries (only the active one runs); keyword results get
 * an extra client-side filter/sort pass, matching previous behavior.
 */
export default function SearchPage() {
	const searchParams = useSearchParams();
	const isSemanticMode = searchParams.searchType === "semantic";

	const { articles, isError, isFetching, refetch, hasNextPage, fetchNextPage } =
		useSearchResults(searchParams);

	// Keyword path keeps the client-side filter/sort pass
	const filters: SearchFilters = {
		query: searchParams.query,
		dateRange: searchParams.dateRange as SearchFilters["dateRange"],
		sortBy: searchParams.sortBy as SearchFilters["sortBy"],
	};
	const filteredArticles = useFilteredArticles(articles, filters);
	const articlesToDisplay = isSemanticMode ? articles : filteredArticles;

	useSearchInfiniteScroll({
		enabled: !!searchParams.query,
		hasNextPage,
		isFetching,
		fetchNextPage,
	});

	return (
		<div>
			<SearchSection
				query={searchParams.query}
				dateRange={searchParams.dateRange}
				sortBy={searchParams.sortBy}
				searchType={searchParams.searchType}
			/>

			{searchParams.query && isError && (
				<SectionErrorMessage onRetry={refetch} />
			)}

			{searchParams.query && !isError && (
				<section>
					{articlesToDisplay.map((article) => (
						<NewsCard key={`search-${article.id}`} articleInfo={article} />
					))}
				</section>
			)}
		</div>
	);
}
