import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import NewsCard from "@/components/news/cards/NewsCard";
import PageMeta from "@/components/common/seo/PageMeta";
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
	const subCategoryName = decodeURIComponent(subCategory || "");

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
			{/* noindex: these are free-form tag listings that repeat articles the
			    category pages already carry, and the server 404s them anyway (no
			    file on disk, see prerenderRoutes.mjs). Drop the flag if they are
			    ever prerendered and worth ranking on their own. Links still count. */}
			<PageMeta
				title={t("SEO.SUBCATEGORY.TITLE", { subCategory: subCategoryName })}
				description={t("SEO.SUBCATEGORY.DESCRIPTION", { subCategory: subCategoryName })}
				noindex
			/>
			<SectionHeader title={subCategoryName} as="h1" />

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
							<p className="py-4 text-muted-foreground">
								{t("PAGES.SUBCATEGORY.NO_ARTICLES")}
							</p>
						)
					)}
				</section>
			)}

			{/* Loading indicator for infinite scroll */}
			{isFetching && (
				<p className="py-4 text-muted-foreground text-center">
					{t("PAGES.SUBCATEGORY.LOADING_MORE")}
				</p>
			)}

			{!isFetching && !isError && !hasNextPage && articles.length > 0 && (
				<p className="py-4 text-muted-foreground text-center">
					{t("PAGES.SUBCATEGORY.NO_MORE_ARTICLES")}
				</p>
			)}
		</div>
	);
}

export default SubCategoryPage;
