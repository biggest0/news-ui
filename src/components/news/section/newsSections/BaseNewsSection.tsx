import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import NewsSideColumn from "../../shared/NewsSideColumn";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { ArticleInfo, ArticleInfoRequest } from "@/types/articleTypes";
import type { RootState } from "@/store/store";
import {
	useArticleHistory,
	useArticleFilters,
	useInfiniteScroll,
} from "@/hooks/useArticleHooks";
import { FilterBar } from "../../shared/FilterBar";
import { ArticleList } from "../../shared/ArticleList";
import { LoadingMessage } from "../../shared/LoadingMessage";

interface BaseNewsSectionProps {
	articles: ArticleInfo[];
	loadMoreArticles: (request: ArticleInfoRequest) => void;
	resetKey?: string;
}

export function BaseNewsSection({
	articles,
	loadMoreArticles,
	resetKey,
}: BaseNewsSectionProps) {
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];
	const { loading } = useSelector((state: RootState) => state.article);

	const handleLocalStorageUpdate = useArticleHistory();

	const { articlesToDisplay, dateRange, setDateRange, sortBy, setSortBy } =
		useArticleFilters(articles);

	const resetFilterState = useInfiniteScroll({
		articlesLength: articles.length,
		filteredArticlesLength: articlesToDisplay.length,
		loadMoreArticles,
		selectedCategory,
		resetKey,
	});

	const handleDateRangeChange = (value: string) => {
		setDateRange(value);
		resetFilterState();
	};

	const handleSortByChange = (value: string) => {
		setSortBy(value);
		resetFilterState();
	};

	return (
		<div className="flex flex-col md:grid md:grid-cols-3 gap-x-4 gap-y-6 pt-6">
			{/* Articles, main col */}
			<section className="md:col-span-2">
				<div className="flex flex-row justify-between w-full items-center">
					<SectionHeader title="MEWS" />
					<FilterBar
						dateRange={dateRange}
						sortBy={sortBy}
						onDateRangeChange={handleDateRangeChange}
						onSortByChange={handleSortByChange}
					/>
				</div>

				<ArticleList
					articles={articlesToDisplay}
					onArticleRead={handleLocalStorageUpdate}
				/>

				<LoadingMessage isLoading={loading.articles} />
			</section>

			{/* Side col for md screen and larger */}
			<div className="hidden md:flex flex-col space-y-6 pl-4 border-l border-gray-400">
				<NewsSideColumn />
			</div>
		</div>
	);
}
