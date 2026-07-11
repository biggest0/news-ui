import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import NewsCard from "@/components/news/cards/NewsCard";
import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { SectionErrorMessage } from "@/components/common/feedback/SectionErrorMessage";
import { useApiLang } from "@/hooks/useApiLang";
import { useListInfiniteScroll } from "@/hooks/useArticleHooks";
import { useGetArticlesInfiniteQuery } from "@/store/api/articleEndpoints";

/**
 * Sub-category listing — RTK Query infinite query keyed by
 * {subCategory, lang}; shares the scroll driver with the main news lists.
 */
function SubCategoryPage() {
	const { subCategory } = useParams<{ subCategory: string }>();
	const { t } = useTranslation();
	const lang = useApiLang();

	const {
		data,
		isFetching,
		isError,
		refetch,
		hasNextPage,
		fetchNextPage,
	} = useGetArticlesInfiniteQuery(
		{ subCategory: subCategory ?? "", lang },
		{ skip: !subCategory }
	);
	const articles = data?.pages.flatMap((p) => p.articles) ?? [];

	useListInfiniteScroll({
		enabled: !!subCategory,
		hasNextPage: !!hasNextPage,
		isFetching,
		fetchNextPage,
	});

	return (
		<div className="py-6">
			<SectionHeader title={decodeURIComponent(subCategory || "")} />

			{isError && <SectionErrorMessage onRetry={refetch} />}

			{!isError && (
				<section>
					{articles.length > 0 ? (
						articles.map((article) => (
							<NewsCard
								key={`subcategory-${article.id}`}
								articleInfo={article}
							/>
						))
					) : (
						!isFetching && (
							<div className="py-4 text-muted-foreground">
								{t("PAGES.SUBCATEGORY.NO_ARTICLES")}
							</div>
						)
					)}
				</section>
			)}

			{/* Loading indicator for infinite scroll */}
			{isFetching && (
				<div className="py-4 text-muted-foreground text-center">
					{t("PAGES.SUBCATEGORY.LOADING_MORE")}
				</div>
			)}

			{!isFetching && !isError && !hasNextPage && articles.length > 0 && (
				<div className="py-4 text-muted-foreground text-center">
					{t("PAGES.SUBCATEGORY.NO_MORE_ARTICLES")}
				</div>
			)}
		</div>
	);
}

export default SubCategoryPage;
