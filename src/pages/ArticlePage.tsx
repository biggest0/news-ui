import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import type { AppDispatch, RootState } from "@/store/store";
import { loadArticleDetail } from "@/store/articlesSlice";
import ArticleDetailSection from "@/components/news/section/ArticleDetailSection";

export default function ArticlePage() {
	const { id } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const articleDetail = useSelector((state: RootState) =>
		id ? state.article.articlesDetail[id] : undefined
	);
	const { loading } = useSelector((state: RootState) => state.article);

	useEffect(() => {
		if (id) {
			dispatch(loadArticleDetail(id));
		}
	}, [id]);

	return (
		<div className="py-6">
			{articleDetail && <ArticleDetailSection article={articleDetail} />}
			{loading.detail && !articleDetail && <div>Loading article details!</div>}
		</div>
	);
}
