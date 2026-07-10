import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import type { AppDispatch, RootState } from "@/store/store";
import placeholderBanner from "@/assets/news_banner_placeholder.jpg";
import { loadArticleDetail } from "@/store/articlesSlice";
import { incrementArticleViewed } from "@/api/articleApi";
import { recordArticleRead } from "@/service/userArticleService";
import { useAuth } from "@/contexts/AuthContext";
import ArticleDetailSection from "@/components/news/section/ArticleDetailSection";
import SimilarArticlesSection from "@/components/news/section/SimilarArticlesSection";

export default function ArticlePage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const { isAuthenticated } = useAuth();
	const articleDetail = useSelector((state: RootState) =>
		id ? state.article.articlesDetail[id] : undefined
	);
	const { loading } = useSelector((state: RootState) => state.article);

	// Load the article + count the view exactly once per article id.
	// Deliberately NOT keyed on auth state — re-running would double-count views.
	useEffect(() => {
		if (id) {
			dispatch(loadArticleDetail(id));
			incrementArticleViewed(id);
		}
	}, [id, dispatch]);

	// Record reading history separately: on direct navigation the silent token
	// refresh resolves *after* mount, so this must re-run when auth flips to
	// true — previously (single effect keyed on [id] only) logged-in users
	// landing directly on an article never got a history entry (M4 fix).
	useEffect(() => {
		if (id && isAuthenticated) {
			recordArticleRead(id);
		}
	}, [id, isAuthenticated]);

	return (
		<div className="py-6">
			{/* Back button */}
			<button
				onClick={() => navigate(-1)}
				className="text-md text-brand hover:underline mb-4"
			>
				← {t("COMMON.BACK")}
			</button>

			<div className="max-w-3xl mx-auto">
				{/* Banner image — placeholder until articles supply their own image URL */}
				<img
					src={placeholderBanner}
					alt={articleDetail?.title ?? ""}
					className="w-full h-64 object-cover rounded-lg mb-4"
				/>

				{articleDetail && <ArticleDetailSection article={articleDetail} />}
				{loading.detail && !articleDetail && <div>{t("PAGES.ARTICLE.LOADING_DETAILS")}</div>}
				{id && <SimilarArticlesSection articleId={id} />}
			</div>
		</div>
	);
}
