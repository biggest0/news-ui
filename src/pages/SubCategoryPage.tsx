import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";
import NewsCard from "@/components/news/cards/NewsCard";
import { SectionHeader } from "@/components/common/layout/SectionHeader";
import {
	useSubCategoryArticles,
	useSubCategoryInfiniteScroll,
} from "@/hooks/useSubCategoryPage";

function SubCategoryPage() {
	const { subCategory } = useParams<{ subCategory: string }>();
	const { articles, articlesCount, loading, error } = useSelector(
		(state: RootState) => state.article
	);

	// Load initial articles when subcategory changes
	useSubCategoryArticles(subCategory);

	// Handle infinite scroll using count from API
	const { hasMore } = useSubCategoryInfiniteScroll({
		currentArticlesCount: articles.length,
		totalArticlesCount: articlesCount,
		subCategory,
	});

	return (
		<div className="py-6">
			<SectionHeader title={decodeURIComponent(subCategory || "")} />

			{error.articles && (
				<div className="py-4 text-red-500">Error: {error.articles}</div>
			)}

			{!error.articles && (
				<section>
					{articles.length > 0 ? (
						articles.map((article) => (
							<NewsCard
								key={`subcategory-${article.id}`}
								articleInfo={article}
							/>
						))
					) : (
						!loading.articles && (
							<div className="py-4 text-gray-500">
								No articles found for this subcategory.
							</div>
						)
					)}
				</section>
			)}

			{/* Loading indicator for infinite scroll */}
			{loading.articles && (
				<div className="py-4 text-gray-500 text-center">Loading more...</div>
			)}

			{!loading.articles && !hasMore && (
				<div className="py-4 text-gray-500 text-center">
					No more articles found for this subcategory.
				</div>
			)}
		</div>
	);
}

export default SubCategoryPage;
