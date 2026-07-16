import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { SectionErrorMessage } from "@/components/common/feedback/SectionErrorMessage";
import { incrementArticleViewed } from "@/api/articleApi";
import { useAuth } from "@/contexts/AuthContext";
import { useApiLang } from "@/hooks/useApiLang";
import { useGetSimilarArticlesQuery } from "@/store/api/recommendationEndpoints";
import { useRecordArticleReadMutation } from "@/store/api/userContentEndpoints";

interface SimilarArticlesSectionProps {
	articleId: string;
}

/**
 * "More like this" strip under an article — RTK Query consumer, cached per
 * {articleId, lang} (replaces the slice's hand-rolled similar[articleId] map).
 */
export default function SimilarArticlesSection({
	articleId,
}: SimilarArticlesSectionProps) {
	const { t } = useTranslation();
	const { isAuthenticated } = useAuth();
	const lang = useApiLang();
	// fire-and-forget: triggered without await (invalidates History)
	const [recordArticleRead] = useRecordArticleReadMutation();
	const {
		data: similarArticles,
		isLoading,
		isError,
		refetch,
	} = useGetSimilarArticlesQuery({ articleId, lang });

	const handleClick = (clickedArticleId: string) => {
		incrementArticleViewed(clickedArticleId);
		if (isAuthenticated) {
			recordArticleRead(clickedArticleId);
		}
	};

	// nothing similar → render nothing (matches previous behavior)
	if (!isLoading && !isError && (similarArticles?.length ?? 0) === 0) {
		return null;
	}

	return (
		<section className="pt-8 border-t border-border mt-8">
			<SectionHeader title={t("SECTION.MORE_LIKE_THIS")} />
			{isError ? (
				<SectionErrorMessage onRetry={refetch} />
			) : isLoading ? (
				<div className="py-4 text-muted-foreground">{t("COMMON.LOADING")}</div>
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
									className="font-medium text-foreground hover:text-brand transition-colors duration-200 cursor-pointer text-sm"
									onClick={() => handleClick(article.id)}
								>
									{article.title}
								</Link>
								<div className="text-xs text-muted-foreground">{article.datePublished}</div>
								{article.summary && (
									<div className="text-xs text-foreground-secondary line-clamp-2">
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
