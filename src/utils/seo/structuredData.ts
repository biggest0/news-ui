import {
	PUBLISHER_LOGO,
	SITE_ALTERNATE_NAME,
	SITE_NAME,
} from "@/constants/site";
import { absoluteUrl, assetUrl } from "@/utils/seo/urlUtils";

/**
 * JSON-LD builders for the page-level structured data that <PageMeta> emits.
 *
 * The site-wide Organization + WebSite graph lives statically in index.html
 * (so every prerendered shell carries it); these builders cover what changes
 * per page. `scripts/prerenderRoutes.mjs` produces the same shapes at build
 * time from the raw API data, so a crawler that never runs JavaScript sees
 * identical markup. Keep the two in step when changing a shape.
 */

/** A JSON-LD node. Loose on purpose: schema.org vocab is open-ended. */
export type JsonLd = Record<string, unknown>;

/** One breadcrumb: the visible label and the route path it links to. */
export interface BreadcrumbItem {
	name: string;
	/** Router path, e.g. `/science`; resolved to an absolute URL in the markup. */
	path: string;
}

export interface ArticleJsonLdInput {
	/** Canonical absolute URL of the article page. */
	url: string;
	headline: string;
	description?: string;
	/** ISO 8601 timestamp from the backend. */
	datePublished: string;
	/** Byline as rendered on the page (including the chief-editor fallback). */
	author: string;
	/** Translated main category, e.g. "Science". */
	section?: string;
	/** Sub-category tags. */
	keywords?: string[];
	/** Absolute image URL. */
	imageUrl: string;
	/** BCP 47 language of the content, "en" or "fr". */
	language: string;
}

export interface BlogPostingJsonLdInput {
	url: string;
	headline: string;
	description: string;
	/** `YYYY-MM-DD`; omitted from the output when undefined. */
	datePublished?: string;
	imageUrl: string;
	keywords?: string[];
}

/**
 * Publisher node, inlined into every article so each page's markup is
 * self-contained (no @id reference to a node in another script tag).
 */
export function publisherJsonLd(): JsonLd {
	return {
		"@type": "Organization",
		name: SITE_NAME,
		alternateName: SITE_ALTERNATE_NAME,
		url: absoluteUrl("/"),
		logo: {
			"@type": "ImageObject",
			url: assetUrl(PUBLISHER_LOGO.path),
			width: PUBLISHER_LOGO.width,
			height: PUBLISHER_LOGO.height,
		},
	};
}

/**
 * BreadcrumbList for the trail rendered by <Breadcrumbs>. Google requires the
 * markup to reflect a visible trail, so build both from the same items.
 * @param items - crumbs in order, home first, current page last
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path),
		})),
	};
}

/**
 * Article markup for a satire piece.
 *
 * Typed as both NewsArticle and SatiricalArticle, and both are accurate:
 * schema.org notes that a SatiricalArticle "is sometimes but not necessarily
 * also a NewsArticle". NewsArticle keeps the page eligible for Article rich
 * results; SatiricalArticle discloses the genre to machines the same way the
 * disclaimer page does to readers.
 */
export function newsArticleJsonLd(input: ArticleJsonLdInput): JsonLd {
	const node: JsonLd = {
		"@context": "https://schema.org",
		"@type": ["NewsArticle", "SatiricalArticle"],
		mainEntityOfPage: input.url,
		url: input.url,
		headline: input.headline,
		image: [input.imageUrl],
		datePublished: input.datePublished,
		author: { "@type": "Person", name: input.author },
		publisher: publisherJsonLd(),
		inLanguage: input.language,
		isAccessibleForFree: true,
	};

	// optional fields: only emit what the article actually has
	if (input.description) node.description = input.description;
	if (input.section) node.articleSection = input.section;
	if (input.keywords && input.keywords.length > 0) node.keywords = input.keywords;

	return node;
}

/** BlogPosting markup for a post from blog/registry.ts. */
export function blogPostingJsonLd(input: BlogPostingJsonLdInput): JsonLd {
	const node: JsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		mainEntityOfPage: input.url,
		url: input.url,
		headline: input.headline,
		description: input.description,
		image: [input.imageUrl],
		author: publisherJsonLd(),
		publisher: publisherJsonLd(),
		inLanguage: "en",
	};

	if (input.datePublished) node.datePublished = input.datePublished;
	if (input.keywords && input.keywords.length > 0) node.keywords = input.keywords;

	return node;
}
