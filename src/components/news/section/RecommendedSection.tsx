import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { RootState, AppDispatch } from "@/store/store";
import { loadRecommendedArticles } from "@/store/recommendationsSlice";
import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { useAuth } from "@/contexts/AuthContext";
import { incrementArticleViewed } from "@/api/articleApi";
import { recordArticleRead } from "@/service/userArticleService";

export default function RecommendedSection() {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const { accessToken, isAuthenticated, isLoading } = useAuth();
	const isVisible = useSectionVisible(SECTIONS.RECOMMENDED);
	const { recommended: recommendedArticles, loading } = useSelector(
		(state: RootState) => state.recommendations
	);

	useEffect(() => {
		if (!isLoading && isAuthenticated && accessToken) {
			dispatch(loadRecommendedArticles(accessToken));
		}
	}, [isLoading, isAuthenticated, accessToken, dispatch]);

	if (!isAuthenticated || (!loading.recommended && recommendedArticles.length === 0)) {
		return null;
	}

	const handleClick = (articleId: string) => {
		incrementArticleViewed(articleId);
		if (accessToken) {
			recordArticleRead(articleId, accessToken);
		}
	};

	return (
		<section
			className={`border-b border-gray-400 py-6 ${isVisible ? "" : "hidden"}`}
		>
			<SectionHeaderExpandable
				title={t("SECTION.RECOMMENDED")}
				section={SECTIONS.RECOMMENDED}
			/>
			<CollapsibleSection section={SECTIONS.RECOMMENDED}>
				{loading.recommended ? (
					<div className="py-4 text-muted">{t("COMMON.LOADING")}</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 py-4">
						{recommendedArticles.map((article) => (
							<div key={`recommended-${article.id}`} className="space-y-1">
								<Link
									to={`/article/${article.id}`}
									className="font-medium text-primary hover:text-accent transition-colors duration-200 cursor-pointer"
									onClick={() => handleClick(article.id)}
								>
									{article.title}
								</Link>
								<div className="text-sm text-muted">{article.datePublished}</div>
							</div>
						))}
					</div>
				)}
			</CollapsibleSection>
		</section>
	);
}
