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
 * Run via `npm run predeploy`. Verify after deploying with:
 *   curl -s -o /dev/null -w "%{http_code} %{url_effective}\n" -L https://www.catiretime.com/about
 */
import { cp, mkdir, readFile, readdir, rm } from "node:fs/promises";
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
 * NOTE: /privacy is not here yet. Adding a route before the page exists would
 * serve a 200 that renders "Page not Found" — a soft 404, which is worse for
 * SEO than the honest 404 we have now. Add it when the page ships.
 */
const STATIC_ROUTES = ["about", "contact", "disclaimer", "search", "blog"];

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
 * treats as authoritative — the filename only happens to match today.
 * @returns {Promise<string[]>} slugs, e.g. ["welcome", …]
 */
async function readBlogRoutes() {
	const files = (await readdir("src/blog/posts")).filter((f) => f.endsWith(".tsx"));
	const slugs = [];

	for (const file of files) {
		const source = await readFile(join("src/blog/posts", file), "utf8");
		const match = source.match(/slug:\s*"([^"]+)"/);

		if (!match) {
			throw new Error(`No meta.slug found in src/blog/posts/${file}`);
		}
		slugs.push(`blog/${match[1]}`);
	}

	return slugs;
}

// ── build the route list ──────────────────────────────────────────────

const categories = await readCategoryRoutes();
const blogPosts = await readBlogRoutes();
const routes = [...STATIC_ROUTES, ...categories, ...blogPosts];

// ── write a directory per route ───────────────────────────────────────

for (const route of routes) {
	const dir = join(DIST, route);
	await mkdir(dir, { recursive: true });
	await cp(SHELL, join(dir, "index.html"));
}

// Genuinely unknown URLs should still 404, with the SPA as the body so that
// client-side deep links (article pages) keep working until Tier 2.
await cp(SHELL, join(DIST, "404.html"));

// macOS litter that would otherwise be published to the live site
await rm(join(DIST, ".DS_Store"), { force: true });

console.log(
	`prerendered ${routes.length} routes ` +
		`(${STATIC_ROUTES.length} static, ${categories.length} categories, ${blogPosts.length} blog)`
);
