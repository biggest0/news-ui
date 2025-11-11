import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";
import NewsCard from "@/components/news/NewsCard";
import SearchSection from "@/components/search/SearchSection";
import {
	useSearchParams,
	useSearchArticles,
	useFilteredArticles,
	useSearchPagination,
	useInfiniteScroll,
} from "@/hooks/useSearchPage";
import type { SearchFilters } from "@/utils/searchUtils";

export default function SearchPage() {
	const { articles } = useSelector((state: RootState) => state.article);
	const searchParams = useSearchParams();

	// Load articles when query changes
	useSearchArticles(searchParams.query);

	// Filter and sort articles
	const filters: SearchFilters = {
		query: searchParams.query,
		dateRange: searchParams.dateRange as SearchFilters["dateRange"],
		sortBy: searchParams.sortBy as SearchFilters["sortBy"],
	};
	const filteredArticles = useFilteredArticles(articles, filters);

	// Check if filters are applied
	const hasFilters = Boolean(filters.dateRange || filters.sortBy);

	// Handle pagination (based on filtered articles)
	const { page, setPage, showMore, fetching, setFetching } =
		useSearchPagination(filteredArticles, filters);

	// Handle infinite scroll
	useInfiniteScroll(
		searchParams.query,
		showMore,
		fetching,
		page,
		setPage,
		setFetching,
		hasFilters
	);

	return (
		<div>
			<SearchSection
				query={searchParams.query}
				dateRange={searchParams.dateRange}
				sortBy={searchParams.sortBy}
			/>

			{/* Section for searched articles */}
			{searchParams.query && (
				<section>
					{filteredArticles.map((article) => (
						<NewsCard key={`search-${article.id}`} articleInfo={article} />
					))}
				</section>
			)}
		</div>
	);
}
