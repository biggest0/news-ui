import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { SHARE_IMAGE } from "@/constants/site";
import type { JsonLd } from "@/utils/seo/structuredData";
import { absoluteUrl, assetUrl } from "@/utils/seo/urlUtils";

/** Open Graph `article:*` details, emitted only when `type="article"`. */
export interface ArticleMeta {
	/** ISO 8601 timestamp. */
	publishedTime?: string;
	/** ISO 8601 timestamp. */
	modifiedTime?: string;
	/** Translated main category, e.g. "Science". */
	section?: string;
	/** One `article:tag` per entry. */
	tags?: string[];
	/** Byline as rendered on the page. */
	author?: string;
}

interface PageMetaProps {
	/** Page-specific part of the title; the site name is appended automatically. */
	title: string;
	/** Meta description. Falls back to the site default so a page can never
	 *  inherit the previous page's description. */
	description?: string;
	/**
	 * Route path for the canonical URL and `og:url`. Defaults to the current
	 * location; query strings and hashes are always dropped, so `/search?q=x`
	 * canonicalises to `/search/`.
	 */
	path?: string;
	/** Open Graph type. `"article"` also emits the `article:*` tags. */
	type?: "website" | "article";
	article?: ArticleMeta;
	/** Absolute share-image URL. Defaults to the site image from constants/site.ts. */
	image?: string;
	/**
	 * Keep the page out of search results while still letting crawlers follow
	 * its links. For auth flows, internal search results, tag pages and 404s.
	 */
	noindex?: boolean;
	/**
	 * Page-level JSON-LD (Article, BreadcrumbList, ...). Rendered into one
	 * `<script type="application/ld+json" data-seo="page">`, replaced whenever
	 * it changes and removed on unmount. The site-wide Organization/WebSite
	 * graph is static in index.html under `data-seo="site"` and is never touched.
	 */
	jsonLd?: JsonLd | JsonLd[];
}

const ROBOTS_INDEX = "index, follow, max-image-preview:large";
const ROBOTS_NOINDEX = "noindex, follow";

/**
 * Upserts a `<meta>` tag in place, or removes it when `content` is undefined.
 * Editing the existing element (rather than appending a second one) is what
 * keeps exactly one tag per key in the head.
 */
function setMetaTag(attr: "name" | "property", key: string, content: string | undefined) {
	let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
	if (content === undefined) {
		tag?.remove();
		return;
	}
	if (!tag) {
		tag = document.createElement("meta");
		tag.setAttribute(attr, key);
		document.head.appendChild(tag);
	}
	tag.setAttribute("content", content);
}

/** Upserts a `<link rel=...>` tag's href in place. */
function setLinkTag(rel: string, href: string) {
	let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
	if (!tag) {
		tag = document.createElement("link");
		tag.setAttribute("rel", rel);
		document.head.appendChild(tag);
	}
	tag.setAttribute("href", href);
}

/** Replaces the whole `article:tag` set: Open Graph wants one meta element per tag. */
function setArticleTags(tags: string[]) {
	document.head.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove());
	for (const tag of tags) {
		const el = document.createElement("meta");
		el.setAttribute("property", "article:tag");
		el.setAttribute("content", tag);
		document.head.appendChild(el);
	}
}

/**
 * Sets the document title, description, canonical URL, robots directive,
 * Open Graph / Twitter tags and page-level JSON-LD for the current route.
 *
 * Everything is set imperatively, editing the tags index.html already ships
 * rather than rendering new ones. Verified in a real browser rather than
 * assumed, because React 19's hoisting does the wrong thing for both:
 *
 * - **Title.** Rendering `<title>` hoists a *second* title into <head> ahead of
 *   index.html's. The page-specific one wins, so it looked correct, but two
 *   title elements is invalid HTML and leaves a crawler two values to choose
 *   from. `document.title` updates the one that already exists.
 * - **Description.** React appends a hoisted `<meta>` *after* the static one,
 *   and the first wins, so a rendered description would silently lose to the
 *   generic site description on every page.
 *
 * The prerender step (scripts/prerenderRoutes.mjs) writes the same tags into
 * each route's HTML at build time, so crawlers and link scrapers that never
 * run JavaScript see the page's own metadata too. This component then keeps
 * them correct across client-side navigation and language switches.
 */
export default function PageMeta({
	title,
	description,
	path,
	type = "website",
	article,
	image,
	noindex = false,
	jsonLd,
}: PageMetaProps) {
	const { t, i18n } = useTranslation();
	const location = useLocation();

	const siteName = t("SEO.SITE_NAME");
	const fullTitle = `${title} | ${siteName}`;
	const metaDescription = description ?? t("SEO.HOME.DESCRIPTION");
	const canonical = absoluteUrl(path ?? location.pathname);
	const shareImage = image ?? assetUrl(SHARE_IMAGE.path);
	const isDefaultImage = image === undefined;
	const isFrench = i18n.resolvedLanguage === "fr";

	// Serialised so the effects re-run on content changes, not on new object identity.
	const articleJson = JSON.stringify(article ?? null);
	const jsonLdText = jsonLd === undefined ? undefined : JSON.stringify(jsonLd);

	// Head tags
	useEffect(() => {
		// Overwrites index.html's title rather than adding a second one.
		document.title = fullTitle;
		setMetaTag("name", "description", metaDescription);
		setMetaTag("name", "robots", noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX);
		setLinkTag("canonical", canonical);

		// Open Graph
		setMetaTag("property", "og:type", type);
		setMetaTag("property", "og:title", fullTitle);
		setMetaTag("property", "og:description", metaDescription);
		setMetaTag("property", "og:url", canonical);
		setMetaTag("property", "og:image", shareImage);
		setMetaTag("property", "og:image:width", isDefaultImage ? String(SHARE_IMAGE.width) : undefined);
		setMetaTag("property", "og:image:height", isDefaultImage ? String(SHARE_IMAGE.height) : undefined);
		setMetaTag("property", "og:locale", isFrench ? "fr_CA" : "en_CA");
		setMetaTag("property", "og:locale:alternate", isFrench ? "en_CA" : "fr_CA");

		// Twitter cards (card type + @site are static in index.html)
		setMetaTag("name", "twitter:title", fullTitle);
		setMetaTag("name", "twitter:description", metaDescription);
		setMetaTag("name", "twitter:image", shareImage);

		// article:* only exists on article pages; cleared everywhere else so a
		// blog post's tags never linger on the page navigated to next
		const meta: ArticleMeta | null = JSON.parse(articleJson);
		const isArticle = type === "article";
		setMetaTag("property", "article:published_time", isArticle ? meta?.publishedTime : undefined);
		setMetaTag("property", "article:modified_time", isArticle ? meta?.modifiedTime : undefined);
		setMetaTag("property", "article:section", isArticle ? meta?.section : undefined);
		setMetaTag("property", "article:author", isArticle ? meta?.author : undefined);
		setArticleTags(isArticle ? (meta?.tags ?? []) : []);
	}, [
		fullTitle,
		metaDescription,
		canonical,
		type,
		shareImage,
		isDefaultImage,
		isFrench,
		noindex,
		articleJson,
	]);

	// Page-level JSON-LD: one script tag, owned by whichever PageMeta is mounted.
	// Any existing block goes first: the prerendered shell ships one for its route,
	// and this replaces it with the hydrated (fuller, localized) version.
	useEffect(() => {
		document.head.querySelectorAll('script[data-seo="page"]').forEach((el) => el.remove());
		if (jsonLdText === undefined) return;

		const script = document.createElement("script");
		script.type = "application/ld+json";
		script.dataset.seo = "page";
		// "<" is escaped so a headline containing "</script>" can't end the block
		script.textContent = jsonLdText.replace(/</g, "\\u003c");
		document.head.appendChild(script);

		return () => script.remove();
	}, [jsonLdText]);

	return null;
}
