import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { ArticleDetail } from "@/types/articleTypes";

interface ArticleDetailProps {
	article: ArticleDetail;
}

/**
 * The article body: byline, date, headline, paragraphs and tags.
 *
 * Rendered as a real `<article>` with `<p>` paragraphs rather than stacked
 * `<div>`s (audit N1) — the page is the one on the site most likely to be
 * read by a screen reader, quoted, or parsed by a crawler.
 *
 * The byline falls back to the chief editor when the backend supplies no
 * author, so every piece is credited to someone (audit N3).
 *
 * No source line: articles are researched and written in-house rather than
 * derived from one outlet, so printing "Source: X" would imply an attribution
 * that doesn't exist. The `source` field stays on the DTO — the backend still
 * sends it — it just isn't presented as a citation.
 */
export default function ArticleDetailSection({ article }: ArticleDetailProps) {
	const { t } = useTranslation();

	const author = article.author ?? t("EDITORS.MEOWSTEIN.NAME");

	return (
		<article className="flex flex-col space-y-4">
			{/* Title, byline and date */}
			<header className="pb-6 border-b border-border-subtle">
				<div className="text-sm text-muted-foreground mb-2">
					{article.datePublished}
				</div>
				<h1 className="text-3xl text-foreground">{article.title}</h1>
				<div className="mt-2 text-sm text-muted-foreground">
					{t("ARTICLE_CARD.BY_AUTHOR", { author })}
				</div>
			</header>

			{/* Paragraphs */}
			<div className="space-y-2">
				{article.paragraphs?.map((paragraph, index) => (
					<p
						key={`${article.id}-paragraph-${index}`}
						className="text-foreground-secondary"
					>
						{paragraph}
					</p>
				))}
			</div>

			{/* Sub categories */}
			<div className="flex flex-wrap space-x-4 underline text-sm text-muted-foreground">
				{article.subCategory?.map((subCategory, index) => (
					<Link
						key={`${article.id}-category-${index}`}
						to={`/subcategory/${encodeURIComponent(subCategory)}`}
						className="hover:text-brand transition-colors"
					>
						{subCategory}
					</Link>
				))}
			</div>
		</article>
	);
}
