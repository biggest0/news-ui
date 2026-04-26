import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { RootState, AppDispatch } from "@/store/store";
import { loadSimilarArticles } from "@/store/recommendationsSlice";
import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { incrementArticleViewed } from "@/api/articleApi";
import { recordArticleRead } from "@/service/userArticleService";
import { useAuth } from "@/contexts/AuthContext";

interface SimilarArticlesSectionProps {
	articleId: string;
}

export default function SimilarArticlesSection({ articleId }: SimilarArticlesSectionProps) {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const { accessToken } = useAuth();
	const similarArticles = useSelector(
		(state: RootState) => state.recommendations.similar[articleId]
	);
	const loading = useSelector(
		(state: RootState) => state.recommendations.loading.similar
	);

	useEffect(() => {
		if (articleId) {
			dispatch(loadSimilarArticles(articleId));
		}
	}, [articleId, dispatch]);

	const handleClick = (clickedArticleId: string) => {
		incrementArticleViewed(clickedArticleId);
		if (accessToken) {
			recordArticleRead(clickedArticleId, accessToken);
		}
	};

	if (!loading && (!similarArticles || similarArticles.length === 0)) {
		return null;
	}

	return (
		<section className="pt-8 border-t border-border mt-8">
			<SectionHeader title={t("SECTION.MORE_LIKE_THIS")} />
			{loading && !similarArticles ? (
				<div className="py-4 text-muted">{t("COMMON.LOADING")}</div>
			) : (
				<div className="w-full overflow-x-auto hide-scrollbar pb-4">
					<div className="flex gap-4">
						{similarArticles?.map((article) => (
							<div
								key={`similar-${article.id}`}
								className="flex-shrink-0 w-56 space-y-1"
							>
								<Link
									to={`/article/${article.id}`}
									className="font-medium text-primary hover:text-accent transition-colors duration-200 cursor-pointer text-sm"
									onClick={() => handleClick(article.id)}
								>
									{article.title}
								</Link>
								<div className="text-xs text-muted">{article.datePublished}</div>
								{article.summary && (
									<div className="text-xs text-secondary line-clamp-2">
										{article.summary}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	);
}
