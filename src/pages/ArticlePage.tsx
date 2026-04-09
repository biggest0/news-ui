import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import type { AppDispatch, RootState } from "@/store/store";
import { loadArticleDetail } from "@/store/articlesSlice";
import { incrementArticleViewed } from "@/api/articleApi";
import { recordArticleRead } from "@/service/userArticleService";
import { useAuth } from "@/contexts/AuthContext";
import ArticleDetailSection from "@/components/news/section/ArticleDetailSection";
import SimilarArticlesSection from "@/components/news/section/SimilarArticlesSection";

export default function ArticlePage() {
	const { id } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const { accessToken } = useAuth();
	const articleDetail = useSelector((state: RootState) =>
		id ? state.article.articlesDetail[id] : undefined
	);
	const { loading } = useSelector((state: RootState) => state.article);

	useEffect(() => {
		if (id) {
			dispatch(loadArticleDetail(id));
			incrementArticleViewed(id);
			if (accessToken) {
				recordArticleRead(id, accessToken);
			}
		}
	}, [id]);

	return (
		<div className="py-6">
			{articleDetail && <ArticleDetailSection article={articleDetail} />}
			{loading.detail && !articleDetail && <div>Loading article details!</div>}
			{id && <SimilarArticlesSection articleId={id} />}
		</div>
	);
}
