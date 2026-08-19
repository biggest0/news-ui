/**
 * Post-build step: give every indexable route a real file on disk.
 *
 * GitHub Pages has no rewrite rules. It answers 200 only when the requested
 * path exists as a file, so an SPA served from a single index.html returns
 * **404 for every route except `/`** — which means Google indexes exactly one
 * page of the site. Copying index.html into `dist/<route>/index.html` makes
 * each route a real file, and the 404s become 200s with no hosting change.
 *
 * `dist/404.html` is still written: it is the correct answer for genuinely
 * unknown URLs, and it keeps client-side deep links working for any route not
 * listed here (dynamic article pages, until Tier 2 lands).
 *
 * Also writes dist/sitemap.xml from the same route list, so the two can never
 * disagree about which URLs exist.
 *
 * Run via `npm run predeploy`. Verify after deploying with:
 *   curl -s -o /dev/null -w "%{http_code} %{url_effective}\n" -L https://www.catiretime.com/about
 */
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const SHELL = join(DIST, "index.html");

/**
 * Routes with real, indexable content that exist in App.tsx.
 *
 * Auth and account routes are deliberately absent: they hold nothing a search
 * engine should index, and 404 is the honest answer for a crawler asking for
 * /login. Dynamic routes (/article/:id, /subcategory/:sub) need the API and
 * arrive with Tier 2.
 *
 * Only add a route here once its page actually exists: pre-rendering ahead of
 * the component serves a 200 that renders "Page not Found", and a soft 404 is
 * worse for SEO than an honest miss.
 */
const STATIC_ROUTES = ["about", "contact", "disclaimer", "privacy", "search", "blog"];

/**
 * Reads the category list from constants/routes.ts rather than duplicating it.
 * A second copy would drift silently the first time a category is added.
 * @returns {Promise<string[]>} category slugs, e.g. ["world", "science", …]
 */
async function readCategoryRoutes() {
	const source = await readFile("src/constants/routes.ts", "utf8");
	const block = source.match(/ARTICLE_ROUTES\s*=\s*\[([\s\S]*?)\]/);

	if (!block) {
		throw new Error(
			"Could not find ARTICLE_ROUTES in src/constants/routes.ts — the shape changed. " +
				"Fix this parser rather than letting category routes silently 404."
		);
	}

	const categories = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

	if (categories.length === 0) {
		throw new Error("ARTICLE_ROUTES parsed to an empty list — refusing to build.");
	}

	return categories;
}

/**
 * Reads blog slugs from each post's `meta.slug`, which is what registry.ts
 * treats as authoritative — the filename only happens to match today. The
 * publish date comes along for the sitemap's <lastmod>.
 * @returns {Promise<{route: string, lastmod?: string}[]>}
 */
async function readBlogRoutes() {
	const files = (await readdir("src/blog/posts")).filter((f) => f.endsWith(".tsx"));
	const posts = [];

	for (const file of files) {
		const source = await readFile(join("src/blog/posts", file), "utf8");
		const slug = source.match(/slug:\s*"([^"]+)"/);
		const date = source.match(/date:\s*"([^"]+)"/);

		if (!slug) {
			throw new Error(`No meta.slug found in src/blog/posts/${file}`);
		}

		posts.push({ route: `blog/${slug[1]}`, lastmod: toW3CDate(date?.[1]) });
	}

	return posts;
}

/**
 * Converts a post's M/D/YYYY date to the YYYY-MM-DD a sitemap expects.
 * @param {string | undefined} date
 * @returns {string | undefined} undefined when absent or unparseable — an
 *   omitted <lastmod> is better than a wrong one
 */
function toW3CDate(date) {
	const parts = date?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	if (!parts) return undefined;

	const [, month, day, year] = parts;
	return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// ── build the route list ──────────────────────────────────────────────

const categories = await readCategoryRoutes();
const blogPosts = await readBlogRoutes();

/** Every indexable URL, as {route, lastmod?}. "" is the home page. */
const pages = [
	{ route: "" },
	...STATIC_ROUTES.map((route) => ({ route })),
	...categories.map((route) => ({ route })),
	...blogPosts,
];

const routes = [...STATIC_ROUTES, ...categories, ...blogPosts.map((p) => p.route)];

// ── write a directory per route ───────────────────────────────────────

for (const route of routes) {
	const dir = join(DIST, route);
	await mkdir(dir, { recursive: true });
	await cp(SHELL, join(dir, "index.html"));
}

// Genuinely unknown URLs should still 404, with the SPA as the body so that
// client-side deep links (article pages) keep working until Tier 2.
await cp(SHELL, join(DIST, "404.html"));

// ── sitemap ───────────────────────────────────────────────────────────
// Generated from the same list as the directories above, so the sitemap can
// never claim a URL that doesn't exist (or miss one that does).
//
// URLs carry a trailing slash because that is the canonical form: GitHub Pages
// answers /about with a 301 to /about/, and a sitemap full of redirects wastes
// crawl budget and muddies which URL is authoritative.

const siteUrl = JSON.parse(await readFile("package.json", "utf8")).homepage.replace(
	/\/$/,
	""
);

const urlEntries = pages
	.map(({ route, lastmod }) => {
		const loc = route === "" ? `${siteUrl}/` : `${siteUrl}/${route}/`;
		const modified = lastmod ? `\n\t\t<lastmod>${lastmod}</lastmod>` : "";
		return `\t<url>\n\t\t<loc>${loc}</loc>${modified}\n\t</url>`;
	})
	.join("\n");

await writeFile(
	join(DIST, "sitemap.xml"),
	`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		`${urlEntries}\n` +
		`</urlset>\n`
);

// macOS litter that would otherwise be published to the live site
await rm(join(DIST, ".DS_Store"), { force: true });

console.log(
	`prerendered ${routes.length} routes ` +
		`(${STATIC_ROUTES.length} static, ${categories.length} categories, ${blogPosts.length} blog)\n` +
		`sitemap.xml lists ${pages.length} URLs`
);
