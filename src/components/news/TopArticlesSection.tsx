import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import type { RootState, AppDispatch } from "@/store/store";
import { loadTopTenArticles } from "@/store/articlesSlice";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ArticleTitleCard } from "@/components/news/ArticleTitleCard";

export default function TopArticlesSection() {
	const dispatch = useDispatch<AppDispatch>();
	const { topTenArticles, loading, error } = useSelector(
		(state: RootState) => state.article
	);

	useEffect(() => {
		dispatch(loadTopTenArticles());
	}, []);

	return (
		<section className="border-b border-gray-400 py-6 space-y-4">
			<SectionHeader title="POPULAR" />
			<div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 gap-4">
				{topTenArticles.map((article, index) => (
					<ArticleTitleCard
					key={`top-ten-${article.id}`}
						articleId={article.id}
						articleTitle={article.title}
						index={index}
					/>
				))}
			</div>
		</section>
	);
}
