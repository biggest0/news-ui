import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { SectionShell } from "@/components/common/layout/SectionShell";
import { SectionErrorMessage } from "@/components/common/feedback/SectionErrorMessage";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { useAuth } from "@/contexts/AuthContext";
import { useApiLang } from "@/hooks/useApiLang";
import { incrementArticleViewed } from "@/api/articleApi";
import { useGetRecommendedArticlesQuery } from "@/store/api/recommendationEndpoints";
import { useRecordArticleReadMutation } from "@/store/api/userContentEndpoints";

/**
 * Personalized recommendations (authenticated) — RTK Query consumer. The
 * query is skipped until the session is known and authenticated, so anonymous
 * visitors never fire the authed call.
 */
export default function RecommendedSection() {
	const { t } = useTranslation();
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	const isVisible = useSectionVisible(SECTIONS.RECOMMENDED);
	const lang = useApiLang();
	// fire-and-forget: triggered without await (invalidates History)
	const [recordArticleRead] = useRecordArticleReadMutation();
	const {
		data: recommendedArticles = [],
		isLoading,
		isError,
		refetch,
	} = useGetRecommendedArticlesQuery(
		{ lang },
		{ skip: authLoading || !isAuthenticated }
	);

	if (!isAuthenticated || (!isLoading && !isError && recommendedArticles.length === 0)) {
		return null;
	}

	const handleClick = (articleId: string) => {
		incrementArticleViewed(articleId);
		if (isAuthenticated) {
			recordArticleRead(articleId);
		}
	};

	return (
		<SectionShell visible={isVisible} bordered>
			<SectionHeaderExpandable
				title={t("SECTION.RECOMMENDED")}
				section={SECTIONS.RECOMMENDED}
			/>
			<CollapsibleSection section={SECTIONS.RECOMMENDED}>
				{isError ? (
					<SectionErrorMessage onRetry={refetch} />
				) : isLoading ? (
					<div className="py-4 text-muted-foreground">{t("COMMON.LOADING")}</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 py-4">
						{recommendedArticles.map((article) => (
							<div key={`recommended-${article.id}`} className="space-y-1">
								<Link
									to={`/article/${article.id}`}
									className="font-medium text-foreground hover:text-brand transition-colors duration-200 cursor-pointer"
									onClick={() => handleClick(article.id)}
								>
									{article.title}
								</Link>
								<div className="text-sm text-muted-foreground">{article.datePublished}</div>
							</div>
						))}
					</div>
				)}
			</CollapsibleSection>
		</SectionShell>
	);
}
