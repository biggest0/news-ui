import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import placeholderBanner from "@/assets/news_banner_placeholder.webp";
import { incrementArticleViewed } from "@/api/articleApi";
import { useAuth } from "@/contexts/AuthContext";
import { useApiLang } from "@/hooks/useApiLang";
import { useGetArticleDetailQuery } from "@/store/api/articleEndpoints";
import { useRecordArticleReadMutation } from "@/store/api/userContentEndpoints";
import ArticleDetailSection from "@/components/news/section/ArticleDetailSection";
import Breadcrumbs from "@/components/common/navigation/Breadcrumbs";
import PageMeta from "@/components/common/seo/PageMeta";
import { SectionErrorMessage } from "@/components/common/feedback/SectionErrorMessage";
import SimilarArticlesSection from "@/components/news/section/SimilarArticlesSection";
import { buttonVariants } from "@/components/ui/Button";
import { PAGE_ROUTES, categoryPath, isArticleCategory } from "@/constants/routes";
import { SHARE_IMAGE } from "@/constants/site";
import type { CategoryKey } from "@/i18n/types";
import {
	breadcrumbJsonLd,
	newsArticleJsonLd,
	type BreadcrumbItem,
} from "@/utils/seo/structuredData";
import { absoluteUrl, assetUrl } from "@/utils/seo/urlUtils";
import { truncateText } from "@/utils/text/wordUtils";

/** True when the backend answered 404: the article id doesn't exist. */
function isNotFoundError(error: unknown): boolean {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		(error as { status: unknown }).status === 404
	);
}

export default function ArticlePage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useTranslation();
	const { isAuthenticated } = useAuth();
	const lang = useApiLang();
	// fire-and-forget: triggered without await (invalidates History)
	const [recordArticleRead] = useRecordArticleReadMutation();

	// Detail is cached per {id, lang} — a language toggle refetches in place.
	const {
		data: articleDetail,
		isFetching: isDetailLoading,
		isError,
		error,
		refetch,
	} = useGetArticleDetailQuery(id ? { id, lang } : { id: "", lang }, {
		skip: !id,
	});

	// Count the view exactly once per article id.
	// Deliberately NOT keyed on auth state — re-running would double-count views.
	useEffect(() => {
		if (id) {
			incrementArticleViewed(id);
		}
	}, [id]);

	// Record reading history separately: on direct navigation the silent token
	// refresh resolves *after* mount, so this must re-run when auth flips to
	// true — previously (single effect keyed on [id] only) logged-in users
	// landing directly on an article never got a history entry (M4 fix).
	useEffect(() => {
		if (id && isAuthenticated) {
			recordArticleRead(id);
		}
	}, [id, isAuthenticated, recordArticleRead]);

	// ── SEO: breadcrumb trail + Article markup, from the same data the page renders ──
	const category = articleDetail?.mainCategory;
	const categoryName = isArticleCategory(category)
		? t(`CATEGORY.${category.toUpperCase()}` as `CATEGORY.${Uppercase<CategoryKey>}`)
		: undefined;
	const crumbs: BreadcrumbItem[] = articleDetail
		? [
				{ name: t("NAVIGATION.HOME"), path: PAGE_ROUTES.HOME },
				...(isArticleCategory(category) && categoryName
					? [{ name: categoryName, path: categoryPath(category) }]
					: []),
				{ name: articleDetail.title, path: location.pathname },
			]
		: [];
	// Same fallback as ArticleDetailSection's byline, so the markup matches the page
	const author = articleDetail?.author ?? t("EDITORS.MEOWSTEIN.NAME");
	// Summary first; otherwise the opening paragraph, trimmed to snippet length
	const description =
		articleDetail?.summary ??
		(articleDetail?.paragraphs[0] ? truncateText(articleDetail.paragraphs[0]) : undefined);

	// A missing article is a real not-found page, kept out of the index. Without
	// this the route would answer with an empty body under a 200-looking page:
	// a soft 404, which search engines treat worse than an honest one.
	if (isError && isNotFoundError(error)) {
		return (
			<section className="flex flex-col items-center gap-4 py-16 text-center">
				<PageMeta
					title={t("SEO.ARTICLE.NOT_FOUND_TITLE")}
					description={t("PAGES.ARTICLE.NOT_FOUND")}
					noindex
				/>
				<h1 className="font-heading text-2xl text-foreground">
					{t("SEO.ARTICLE.NOT_FOUND_TITLE")}
				</h1>
				<p className="max-w-md text-foreground-secondary">{t("PAGES.ARTICLE.NOT_FOUND")}</p>
				<Link
					to={PAGE_ROUTES.HOME}
					className={buttonVariants({ variant: "default", size: "sm" })}
				>
					{t("PAGES.NOT_FOUND.HOME")}
				</Link>
			</section>
		);
	}

	return (
		<div className="py-6">
			{/* The article's own title/summary — this is the page most likely to
			    be shared or land in search results */}
			{articleDetail && (
				<PageMeta
					title={articleDetail.title}
					description={description}
					type="article"
					article={{
						publishedTime: articleDetail.datePublishedIso,
						section: categoryName,
						tags: articleDetail.subCategory,
						author,
					}}
					jsonLd={[
						newsArticleJsonLd({
							url: absoluteUrl(location.pathname),
							headline: articleDetail.title,
							description,
							datePublished: articleDetail.datePublishedIso,
							author,
							section: categoryName,
							keywords: articleDetail.subCategory,
							imageUrl: assetUrl(SHARE_IMAGE.path),
							language: lang,
						}),
						breadcrumbJsonLd(crumbs),
					]}
				/>
			)}
			{/* Back button */}
			<button
				onClick={() => navigate(-1)}
				className="text-md text-brand hover:underline mb-4"
			>
				← {t("COMMON.BACK")}
			</button>

			<div className="max-w-3xl mx-auto">
				{articleDetail && <Breadcrumbs items={crumbs} />}
				{/* Banner image — placeholder until articles supply their own image URL.
				    Intrinsic size + high fetch priority: it is the page's LCP element. */}
				<img
					src={placeholderBanner}
					alt={articleDetail?.title ?? ""}
					width={1408}
					height={768}
					fetchPriority="high"
					decoding="async"
					className="w-full h-64 object-cover rounded-lg mb-4"
				/>

				{articleDetail && <ArticleDetailSection article={articleDetail} />}
				{isDetailLoading && !articleDetail && <p>{t("PAGES.ARTICLE.LOADING_DETAILS")}</p>}
				{isError && !articleDetail && <SectionErrorMessage onRetry={refetch} />}
				{id && <SimilarArticlesSection articleId={id} />}
			</div>
		</div>
	);
}
