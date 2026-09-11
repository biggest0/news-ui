import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { findBlogPost } from "@/blog/registry";
import placeholderBanner from "@/assets/blogs_banner_placeholder.webp";
import Breadcrumbs from "@/components/common/navigation/Breadcrumbs";
import PageMeta from "@/components/common/seo/PageMeta";
import { PAGE_ROUTES } from "@/constants/routes";
import { SHARE_IMAGE } from "@/constants/site";
import { toIsoDate } from "@/utils/date/dateUtils";
import {
	blogPostingJsonLd,
	breadcrumbJsonLd,
	type BreadcrumbItem,
} from "@/utils/seo/structuredData";
import { absoluteUrl, assetUrl } from "@/utils/seo/urlUtils";

export default function BlogPostPage() {
	const { t } = useTranslation();
	const location = useLocation();
	const navigate = useNavigate();
	const { slug } = useParams<{ slug: string }>();
	const post = slug ? findBlogPost(slug) : undefined;

	if (!post) {
		return (
			<section className="py-6">
				{/* An unknown slug is a not-found page: titled as such and kept out of the index */}
				<PageMeta title={t("BLOG.NOT_FOUND")} noindex />
				<Link to={PAGE_ROUTES.BLOG} className="text-md text-brand hover:underline">
					← {t("BLOG.BACK_TO_BLOG")}
				</Link>
				<p className="pt-6 text-muted-foreground text-center">{t("BLOG.NOT_FOUND")}</p>
			</section>
		);
	}

	const { Component, title, date, tags, summary } = post;
	const isoDate = toIsoDate(date);
	const hasCustomImage = post.image !== undefined;

	// Home / Blog / Post: the trail doubles as the "back to blog" link
	const crumbs: BreadcrumbItem[] = [
		{ name: t("NAVIGATION.HOME"), path: PAGE_ROUTES.HOME },
		{ name: t("BLOG.TITLE"), path: PAGE_ROUTES.BLOG },
		{ name: title, path: location.pathname },
	];

	return (
		<section className="py-6">
			<PageMeta
				title={title}
				description={summary}
				type="article"
				article={{ publishedTime: isoDate, section: t("BLOG.TITLE"), tags }}
				jsonLd={[
					blogPostingJsonLd({
						url: absoluteUrl(location.pathname),
						headline: title,
						description: summary,
						datePublished: isoDate,
						// only an absolute custom image is usable in markup; otherwise the site image
						imageUrl:
							post.image && /^https?:\/\//.test(post.image)
								? post.image
								: assetUrl(SHARE_IMAGE.path),
						keywords: tags,
					}),
					breadcrumbJsonLd(crumbs),
				]}
			/>
			{/* Back button */}
			<button
				onClick={() => navigate(-1)}
				className="text-md text-brand hover:underline mb-4"
			>
				← {t("COMMON.BACK")}
			</button>

			<div className="max-w-3xl mx-auto">
				<Breadcrumbs items={crumbs} />
				{/* Banner image — uses post.image if provided, otherwise falls back to
				    placeholder. Intrinsic size is only known for the placeholder. */}
				<img
					src={post.image ?? placeholderBanner}
					alt={title}
					width={hasCustomImage ? undefined : 1408}
					height={hasCustomImage ? undefined : 768}
					fetchPriority="high"
					decoding="async"
					className="w-full h-64 object-cover rounded-lg mb-2"
				/>

				<header className="pt-4 pb-6 border-b border-border-subtle">
					<time dateTime={isoDate} className="block text-sm text-muted-foreground mb-2">
						{date}
					</time>
					<h1 className="text-3xl text-foreground mb-2">{title}</h1>
					{tags && tags.length > 0 && (
						<div className="flex flex-wrap gap-2 pt-2">
							{tags.map((tag) => (
								<span
									key={tag}
									className="text-sm text-muted-foreground px-2 py-0.5 rounded bg-card border border-border-subtle"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</header>

				<article className="blog-prose pt-6">
					 {/* React component exported from your .tsx post file in the posts/ folder. It just renders it here like any normal component */}
					<Component />
				</article>
			</div>
		</section>
	);
}
