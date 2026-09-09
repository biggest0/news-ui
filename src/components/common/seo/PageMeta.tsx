import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface PageMetaProps {
	/** Page-specific part of the title; the site name is appended automatically. */
	title: string;
	/** Meta description. Falls back to the site default so a page can never
	 *  inherit the previous page's description. */
	description?: string;
}

/**
 * Sets the document title and meta description for the current route.
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
 * index.html keeps its own title and description as the pre-JavaScript
 * fallback, which is what a crawler sees before the app boots. Both are then
 * overwritten in place, so there is exactly one of each at all times.
 *
 * Open Graph tags are updated alongside, so shared links carry the article's
 * own title rather than the site's.
 */
export default function PageMeta({ title, description }: PageMetaProps) {
	const { t } = useTranslation();

	const siteName = t("SEO.SITE_NAME");
	const fullTitle = `${title} | ${siteName}`;
	const metaDescription = description ?? t("SEO.HOME.DESCRIPTION");

	useEffect(() => {
		// Overwrites index.html's title rather than adding a second one.
		document.title = fullTitle;

		/** Updates an existing head tag in place; adds it only if absent. */
		const setMeta = (selector: string, attr: string, value: string) => {
			let tag = document.head.querySelector(selector);
			if (!tag) {
				tag = document.createElement("meta");
				const [, name] = selector.match(/\[(?:name|property)="([^"]+)"\]/) ?? [];
				tag.setAttribute(selector.includes("property") ? "property" : "name", name ?? "");
				document.head.appendChild(tag);
			}
			tag.setAttribute(attr, value);
		};

		setMeta('meta[name="description"]', "content", metaDescription);
		setMeta('meta[property="og:title"]', "content", fullTitle);
		setMeta('meta[property="og:description"]', "content", metaDescription);
	}, [fullTitle, metaDescription]);

	return null;
}
