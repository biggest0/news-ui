import { SITE_URL } from "@/config/config";

/**
 * Normalises a router pathname to the site's canonical form: a leading slash,
 * exactly one trailing slash, and no query string or hash.
 *
 * The trailing slash is canonical because GitHub Pages serves every
 * prerendered route from `<route>/index.html` and 301s the bare path to it.
 * The sitemap is written in the same form, so canonical tags, the sitemap and
 * the server never disagree about which URL is authoritative.
 *
 * @param pathname - e.g. `/about`, `/about/`, `/search?q=cats`
 * @returns e.g. `/about/`; the home page stays `/`
 */
export function canonicalPath(pathname: string): string {
	const bare = pathname
		.split(/[?#]/)[0]
		.replace(/\/+$/, "")
		.replace(/^\/*/, "/");
	return bare === "/" ? "/" : `${bare}/`;
}

/**
 * Absolute canonical URL for a route pathname.
 * @param pathname - router pathname, with or without a trailing slash
 * @returns e.g. `https://www.catiretime.com/about/`
 */
export function absoluteUrl(pathname: string): string {
	return `${SITE_URL}${canonicalPath(pathname)}`;
}

/**
 * Absolute URL for a static file under public/. Unlike routes, files keep
 * their exact path (no trailing slash).
 * @param path - e.g. `/og-image.jpg`
 */
export function assetUrl(path: string): string {
	return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
