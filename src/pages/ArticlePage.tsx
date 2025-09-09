import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import type { AppDispatch, RootState } from "@/store/store";
import { loadArticleDetail } from "@/store/articlesSlice";

export default function ArticlePage() {
	const { id } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const articleDetail = useSelector((state: RootState) =>
		id ? state.article.articlesDetail[id] : undefined
	);
	const articleInfo = useSelector((state: RootState) =>
		id ? state.article.articles.find((article) => article.id === id) : undefined
	);

	useEffect(() => {
		if (id) {
			dispatch(loadArticleDetail(id));
		}
	}, [id]);

	return (
		<div className="py-6">
			{articleDetail && (
				<div className="flex flex-col space-y-4">
					{/* title and date */}
					<div>
						<h3 className="text-lg font-semibold text-gray-800">
							{articleDetail.title}
						</h3>
						<div className="text-sm">{articleDetail.datePublished}</div>
					</div>

					{/* paragraphs */}
					<div className="space-y-2">
						{articleDetail.paragraphs?.map((paragraph, index) => (
							<div key={`${articleDetail.id}-paragraph-${index}}`}>
								{paragraph}
							</div>
						))}
					</div>

					{/* sub category */}
					<div className="flex flex-wrap space-x-4 underline text-sm">
						{articleDetail.subCategory?.map((source, index) => (
							<span key={`${articleDetail.id}-category-${index}}`}>
								{source}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
