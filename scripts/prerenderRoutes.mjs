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
 * unknown URLs.
 *
 * Article pages (Tier 2) are currently DISABLED — see the call site below.
 * `readArticleRoutes()` is kept ready; flip one line to turn them back on.
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

/**
 * Reads VITE_API_URL the same way the app build does, so the two can't point
 * at different backends. CI can override with a real environment variable.
 * @returns {Promise<string>} API base URL without a trailing slash
 */
async function readApiUrl() {
	if (process.env.VITE_API_URL) return process.env.VITE_API_URL.replace(/\/$/, "");

	const env = await readFile(".env.production", "utf8");
	const match = env.match(/^VITE_API_URL=(.+)$/m);

	if (!match) {
		throw new Error("VITE_API_URL not found in .env.production");
	}
	return match[1].trim().replace(/\/$/, "");
}

/**
 * Fetches every article ID so each gets a real file on disk.
 *
 * **Throws rather than degrading.** If this returned an empty list when the
 * API was unreachable, the deploy would quietly ship a site with ~1,200
 * previously-indexed URLs suddenly 404ing — telling Google the entire
 * catalogue vanished. Failing the build is very much the safer outcome.
 *
 * @returns {Promise<{route: string, lastmod?: string}[]>}
 */
async function readArticleRoutes() {
	const api = await readApiUrl();
	// One request: the endpoint honours a limit above the current article count
	const url = `${api}/api/articles?lang=en&limit=100000`;

	const response = await fetch(url).catch((cause) => {
		throw new Error(`Could not reach ${url} — refusing to build`, { cause });
	});

	if (!response.ok) {
		throw new Error(`${url} returned ${response.status} — refusing to build`);
	}

	const { articles } = await response.json();

	if (!Array.isArray(articles) || articles.length === 0) {
		throw new Error(`${url} returned no articles — refusing to build`);
	}

	return articles.map((article) => ({
		route: `article/${article._id}`,
		lastmod: article.date_published?.slice(0, 10),
	}));
}

// ── build the route list ──────────────────────────────────────────────

const categories = await readCategoryRoutes();
const blogPosts = await readBlogRoutes();

/*
 * Article routes (Tier 2) are switched off for now.
 *
 * Consequence to be aware of: with this empty, `/article/<id>` has no file on
 * disk, so GitHub Pages answers **404** for direct hits and crawlers. Articles
 * still work for people browsing the site, because in-app navigation is
 * client-side and never touches the server.
 *
 * To re-enable, restore the call:
 *   const articles = await readArticleRoutes();
 */
const articles = [];

/** Every indexable URL, as {route, lastmod?}. "" is the home page. */
const pages = [
	{ route: "" },
	...STATIC_ROUTES.map((route) => ({ route })),
	...categories.map((route) => ({ route })),
	...blogPosts,
	...articles,
];

const routes = [
	...STATIC_ROUTES,
	...categories,
	...blogPosts.map((p) => p.route),
	...articles.map((a) => a.route),
];

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
		`(${STATIC_ROUTES.length} static, ${categories.length} categories, ` +
		`${blogPosts.length} blog, ${articles.length} articles)\n` +
		`sitemap.xml lists ${pages.length} URLs`
);
