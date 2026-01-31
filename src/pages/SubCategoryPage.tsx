import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";
import { loadArticlesBySubCategory } from "@/store/articlesSlice";
import NewsCard from "@/components/news/cards/NewsCard";
import { SectionHeader } from "@/components/common/layout/SectionHeader";

function SubCategoryPage() {
	const { subCategory } = useParams<{ subCategory: string }>();
	const dispatch = useDispatch<AppDispatch>();
	const { articles, loading, error } = useSelector(
		(state: RootState) => state.article
	);

	useEffect(() => {
		if (subCategory) {
			dispatch(loadArticlesBySubCategory({ page: 1, subCategory }));
		}
	}, [dispatch, subCategory]);

	return (
		<div className="py-6">
			<SectionHeader title={decodeURIComponent(subCategory || "")} />

			{loading.articles && (
				<div className="py-4 text-gray-500">Loading articles...</div>
			)}

			{error.articles && (
				<div className="py-4 text-red-500">Error: {error.articles}</div>
			)}

			{!loading.articles && !error.articles && (
				<section>
					{articles.length > 0 ? (
						articles.map((article) => (
							<NewsCard
								key={`subcategory-${article.id}`}
								articleInfo={article}
							/>
						))
					) : (
						<div className="py-4 text-gray-500">
							No articles found for this subcategory.
						</div>
					)}
				</section>
			)}
		</div>
	);
}

export default SubCategoryPage;
