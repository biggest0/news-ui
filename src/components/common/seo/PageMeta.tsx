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
 * Half declarative, half imperative, and deliberately so — verified in a real
 * browser rather than assumed:
 *
 * - **`<title>` is rendered.** React 19 hoists it into <head> *before* the
 *   static title in index.html, and the first title element wins, so the
 *   page-specific one takes effect.
 * - **The description is set imperatively.** React appends hoisted `<meta>`
 *   *after* the static one, and since the first wins, a rendered description
 *   would silently lose to the generic site description on every page. Editing
 *   the existing tag in place keeps exactly one, with the right value.
 *
 * index.html keeps its own title and description as the pre-JavaScript
 * fallback, which is what a crawler sees before the app boots.
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

	return <title>{fullTitle}</title>;
}
