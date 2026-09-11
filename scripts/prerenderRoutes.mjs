/**
 * Post-build step: give every indexable route a real file on disk, carrying
 * that route's own <head> metadata.
 *
 * GitHub Pages has no rewrite rules. It answers 200 only when the requested
 * path exists as a file, so an SPA served from a single index.html returns
 * **404 for every route except `/`** — which means Google indexes exactly one
 * page of the site. Copying index.html into `dist/<route>/index.html` makes
 * each route a real file, and the 404s become 200s with no hosting change.
 *
 * Each copy is not a verbatim shell. Its <title>, description, canonical,
 * Open Graph / Twitter tags and page-level JSON-LD are rewritten for the
 * route (see `applyMeta`). That is what a crawler or link scraper that never
 * runs JavaScript sees, so it has to be right before hydration; <PageMeta>
 * then keeps the same tags correct across client-side navigation.
 *
 * `dist/404.html` is still written: it is the correct answer for genuinely
 * unknown URLs, and it carries a noindex.
 *
 * Article pages (Tier 2) are ENABLED: `readArticles()` pulls every article
 * from the API so each gets its own file. Without them `/article/<id>` is a
 * 404 to crawlers, which leaves the site's actual content unindexable.
 *
 * Also written, from the same route list so they can never disagree:
 *   - dist/sitemap.xml  (<lastmod> wherever a date is known)
 *   - dist/feed.xml     (RSS 2.0, the newest articles)
 *
 * Run via `npm run predeploy`. Verify after deploying with:
 *   curl -s -o /dev/null -w "%{http_code} %{url_effective}\n" -L https://www.catiretime.com/about
 *   curl -s https://www.catiretime.com/article/<id>/ | grep -o '<title>[^<]*'
 */
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const SHELL_PATH = join(DIST, "index.html");

/** Newest-first cap for the RSS feed. */
const FEED_ITEMS = 50;

/**
 * Routes with real, indexable content that exist in App.tsx, each paired with
 * the `SEO.*` key in src/i18n/en/common.json that holds its title/description.
 *
 * Auth and account routes are deliberately absent: they hold nothing a search
 * engine should index, and 404 is the honest answer for a crawler asking for
 * /login. Article routes are dynamic and come from the API instead, further
 * down. /subcategory/:sub is still absent: those pages are reachable in-app
 * but have no file on disk, so a crawler asking for one gets a 404.
 *
 * Only add a route here once its page actually exists: pre-rendering ahead of
 * the component serves a 200 that renders "Page not Found", and a soft 404 is
 * worse for SEO than an honest miss.
 */
const STATIC_ROUTES = [
	{ route: "about", seoKey: "ABOUT" },
	{ route: "contact", seoKey: "CONTACT" },
	{ route: "disclaimer", seoKey: "DISCLAIMER" },
	{ route: "privacy", seoKey: "PRIVACY" },
	{ route: "search", seoKey: "SEARCH" },
	{ route: "blog", seoKey: "BLOG" },
];

/**
 * Brand constants, mirroring src/constants/site.ts. Duplicated rather than
 * imported because this script runs in plain Node and the TS module can't be
 * loaded without a build step; both files point at each other.
 */
const SITE_NAME = "Catire Time";
const SITE_ALTERNATE_NAME = "Çatire Time";
const SHARE_IMAGE_PATH = "/og-image.jpg";
const PUBLISHER_LOGO = { path: "/images/logo-512.png", width: 512, height: 512 };

// ── inputs ────────────────────────────────────────────────────────────

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
 * Reads one string field out of a post's `meta` literal. Handles escaped
 * quotes inside the value and a value that starts on the next line.
 * @param {string} source
 * @param {string} field
 * @returns {string | undefined}
 */
function readMetaString(source, field) {
	const match = source.match(new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
	return match ? match[1].replace(/\\(.)/g, "$1") : undefined;
}

/**
 * Reads each blog post's `meta` (slug, title, summary, tags, date). The slug
 * is what registry.ts treats as authoritative — the filename only happens to
 * match today. The date feeds the sitemap's <lastmod> and the post's markup.
 * @returns {Promise<{route: string, title: string, summary: string, tags: string[], lastmod?: string}[]>}
 */
async function readBlogPosts() {
	const files = (await readdir("src/blog/posts")).filter((f) => f.endsWith(".tsx"));
	const posts = [];

	for (const file of files) {
		const source = await readFile(join("src/blog/posts", file), "utf8");
		const slug = readMetaString(source, "slug");
		const title = readMetaString(source, "title");
		const summary = readMetaString(source, "summary");
		const tagsBlock = source.match(/tags:\s*\[([^\]]*)\]/);
		const tags = tagsBlock ? [...tagsBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];

		if (!slug || !title || !summary) {
			throw new Error(`src/blog/posts/${file}: meta needs slug, title and summary`);
		}

		posts.push({
			route: `blog/${slug}`,
			title,
			summary,
			tags,
			lastmod: toW3CDate(readMetaString(source, "date")),
		});
	}

	return posts;
}

/**
 * Converts a post's M/D/YYYY date to the YYYY-MM-DD a sitemap expects.
 * Mirrors `toIsoDate()` in src/utils/date/dateUtils.ts.
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
 * Fetches every article (id, title, summary, date, categories) so each gets a
 * real file on disk with its own metadata.
 *
 * **Throws rather than degrading.** If this returned an empty list when the
 * API was unreachable, the deploy would quietly ship a site with every
 * previously-indexed article URL suddenly 404ing — telling Google the entire
 * catalogue vanished. Failing the build is very much the safer outcome.
 *
 * @returns {Promise<Array<{_id: string, title: string, summary?: string, date_published?: string, main_category?: string, sub_category?: string[]}>>}
 */
async function readArticles() {
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

	return articles;
}

// ── html / xml helpers ────────────────────────────────────────────────

/** Escapes text for an HTML/XML attribute or text node. */
function escapeHtml(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/** `<meta attr="key" content="value" />` with the value escaped. */
function metaTag(attr, key, value) {
	return `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`;
}

/** Regex for the one-line `<meta attr="key" …>` tag index.html ships. */
function metaPattern(attr, key) {
	const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`<meta\\s+${attr}="${escapedKey}"[^>]*>`);
}

/**
 * Replaces exactly one existing tag in the shell. Throws when the tag is
 * missing: index.html's per-route tags must stay one-per-line, otherwise the
 * prerender would silently ship every route with the home page's metadata.
 */
function replaceTag(html, pattern, replacement, what) {
	if (!pattern.test(html)) {
		throw new Error(
			`index.html has no ${what} tag on a single line, so the prerender can't ` +
				"set per-route metadata. Restore it (see the SEO comment block in index.html)."
		);
	}
	return html.replace(pattern, replacement);
}

/**
 * @typedef {object} PageMeta
 * @property {string} title          page part of the title; the site name is appended
 * @property {string} [description]  falls back to the site description
 * @property {string} canonical      absolute canonical URL
 * @property {"website"|"article"} [type]
 * @property {string} [publishedTime] ISO 8601, article pages only
 * @property {string} [section]       translated category, article pages only
 * @property {string[]} [tags]        article pages only
 * @property {object|object[]} [jsonLd] page-level structured data
 * @property {boolean} [noindex]
 */

/**
 * Rewrites the shell's SEO tags for one route. The site-wide tags (icons,
 * og:site_name, og:image, twitter:card/site, the data-seo="site" graph) are
 * left untouched; article:* tags and page JSON-LD are appended because the
 * shell ships none of them.
 * @param {string} shell - built dist/index.html
 * @param {PageMeta} meta
 * @param {string} defaultDescription
 * @returns {string}
 */
function applyMeta(shell, meta, defaultDescription) {
	const title = `${meta.title} | ${SITE_NAME}`;
	const description = meta.description ?? defaultDescription;
	const type = meta.type ?? "website";
	let html = shell;

	// replace the one-per-line tags in place
	const set = (attr, key, value) => {
		html = replaceTag(html, metaPattern(attr, key), metaTag(attr, key, value), `${attr}="${key}"`);
	};
	html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`, "<title>");
	html = replaceTag(
		html,
		/<link\s+rel="canonical"[^>]*>/,
		`<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
		'rel="canonical"'
	);
	set("name", "description", description);
	set("name", "robots", meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
	set("property", "og:type", type);
	set("property", "og:title", title);
	set("property", "og:description", description);
	set("property", "og:url", meta.canonical);
	set("name", "twitter:title", title);
	set("name", "twitter:description", description);

	// append what the shell doesn't carry by default
	const extra = [];
	if (type === "article") {
		if (meta.publishedTime) extra.push(metaTag("property", "article:published_time", meta.publishedTime));
		if (meta.section) extra.push(metaTag("property", "article:section", meta.section));
		for (const tag of meta.tags ?? []) extra.push(metaTag("property", "article:tag", tag));
	}
	if (meta.jsonLd) {
		// "<" is escaped so a headline containing "</script>" can't end the block
		const json = JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c");
		extra.push(`<script type="application/ld+json" data-seo="page">${json}</script>`);
	}
	if (extra.length > 0) {
		if (!html.includes("</head>")) throw new Error("dist/index.html has no </head>");
		html = html.replace("</head>", `  ${extra.join("\n    ")}\n  </head>`);
	}

	return html;
}

// ── structured data (mirrors src/utils/seo/structuredData.ts) ─────────

/** Publisher node, inlined so each page's markup is self-contained. */
function publisher(siteUrl) {
	return {
		"@type": "Organization",
		name: SITE_NAME,
		alternateName: SITE_ALTERNATE_NAME,
		url: `${siteUrl}/`,
		logo: {
			"@type": "ImageObject",
			url: `${siteUrl}${PUBLISHER_LOGO.path}`,
			width: PUBLISHER_LOGO.width,
			height: PUBLISHER_LOGO.height,
		},
	};
}

/** @param {{name: string, url: string}[]} items */
function breadcrumbList(items) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

/**
 * NewsArticle + SatiricalArticle (see structuredData.ts for why both). No
 * author here: the list endpoint doesn't carry one, and <PageMeta> adds the
 * rendered byline once the page hydrates.
 */
function newsArticle({ siteUrl, url, headline, description, datePublished, section, keywords }) {
	const node = {
		"@context": "https://schema.org",
		"@type": ["NewsArticle", "SatiricalArticle"],
		mainEntityOfPage: url,
		url,
		headline,
		image: [`${siteUrl}${SHARE_IMAGE_PATH}`],
		datePublished,
		publisher: publisher(siteUrl),
		inLanguage: "en",
		isAccessibleForFree: true,
	};
	if (description) node.description = description;
	if (section) node.articleSection = section;
	if (keywords?.length) node.keywords = keywords;
	return node;
}

function blogPosting({ siteUrl, url, headline, description, datePublished, keywords }) {
	const node = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		mainEntityOfPage: url,
		url,
		headline,
		description,
		image: [`${siteUrl}${SHARE_IMAGE_PATH}`],
		author: publisher(siteUrl),
		publisher: publisher(siteUrl),
		inLanguage: "en",
	};
	if (datePublished) node.datePublished = datePublished;
	if (keywords?.length) node.keywords = keywords;
	return node;
}

// ── build the page list ───────────────────────────────────────────────

const siteUrl = JSON.parse(await readFile("package.json", "utf8")).homepage.replace(/\/$/, "");
const en = JSON.parse(await readFile("src/i18n/en/common.json", "utf8"));

/** Canonical URL for a route ("" is home). Trailing slash: see the sitemap note below. */
const canonical = (route) => (route === "" ? `${siteUrl}/` : `${siteUrl}/${route}/`);
/** Fills `{{name}}` placeholders the way i18next would. */
const interpolate = (text, vars) => text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
/** Newest ISO date in a list of articles, as YYYY-MM-DD (ISO strings sort lexically). */
const newestDate = (list) =>
	list
		.map((a) => a.date_published)
		.filter(Boolean)
		.sort()
		.at(-1)
		?.slice(0, 10);

for (const { seoKey } of STATIC_ROUTES) {
	if (!en.SEO[seoKey]?.TITLE || !en.SEO[seoKey]?.DESCRIPTION) {
		throw new Error(`SEO.${seoKey}.TITLE/DESCRIPTION missing from src/i18n/en/common.json`);
	}
}

const categories = await readCategoryRoutes();
const blogPosts = await readBlogPosts();

/*
 * Article routes (Tier 2).
 *
 * One file per article, so `/article/<id>` answers 200 to a direct hit or a
 * crawler instead of 404. In-app navigation never needed this (it is
 * client-side), but indexing and shared links do.
 *
 * readArticles() throws rather than returning an empty list when the API is
 * unreachable: a silent empty result would ship a build that 404s every
 * article URL, which is exactly the state this call exists to prevent.
 */
const articles = await readArticles();

const categoryLabel = (slug) => en.CATEGORY[slug.toUpperCase()] ?? slug;
const homeCrumb = { name: en.NAVIGATION.HOME, url: canonical("") };

/** @type {(PageMeta & {route: string, lastmod?: string})[]} every indexable page */
const pages = [
	{
		route: "",
		title: en.SEO.HOME.TITLE,
		description: en.SEO.HOME.DESCRIPTION,
		lastmod: newestDate(articles),
	},
	...STATIC_ROUTES.map(({ route, seoKey }) => ({
		route,
		title: en.SEO[seoKey].TITLE,
		description: en.SEO[seoKey].DESCRIPTION,
		lastmod: route === "blog" ? blogPosts.map((p) => p.lastmod).filter(Boolean).sort().at(-1) : undefined,
	})),
	...categories.map((slug) => {
		const name = categoryLabel(slug);
		return {
			route: slug,
			title: interpolate(en.SEO.CATEGORY.TITLE, { category: name }),
			description: interpolate(en.SEO.CATEGORY.DESCRIPTION, { category: name }),
			lastmod: newestDate(articles.filter((a) => a.main_category === slug)),
			// no BreadcrumbList: the category page renders no trail (see ArticlesPage.tsx)
		};
	}),
	...blogPosts.map((post) => ({
		route: post.route,
		title: post.title,
		description: post.summary,
		type: "article",
		publishedTime: post.lastmod,
		section: en.BLOG.TITLE,
		tags: post.tags,
		lastmod: post.lastmod,
		jsonLd: [
			blogPosting({
				siteUrl,
				url: canonical(post.route),
				headline: post.title,
				description: post.summary,
				datePublished: post.lastmod,
				keywords: post.tags,
			}),
			breadcrumbList([
				homeCrumb,
				{ name: en.BLOG.TITLE, url: canonical("blog") },
				{ name: post.title, url: canonical(post.route) },
			]),
		],
	})),
	...articles.map((article) => {
		const route = `article/${article._id}`;
		const isCategory = categories.includes(article.main_category);
		const section = isCategory ? categoryLabel(article.main_category) : undefined;
		return {
			route,
			title: article.title,
			description: article.summary,
			type: "article",
			publishedTime: article.date_published,
			section,
			tags: article.sub_category ?? [],
			lastmod: article.date_published?.slice(0, 10),
			jsonLd: [
				newsArticle({
					siteUrl,
					url: canonical(route),
					headline: article.title,
					description: article.summary,
					datePublished: article.date_published,
					section,
					keywords: article.sub_category,
				}),
				breadcrumbList([
					homeCrumb,
					...(isCategory ? [{ name: section, url: canonical(article.main_category) }] : []),
					{ name: article.title, url: canonical(route) },
				]),
			],
		};
	}),
];

// ── write a file per route ────────────────────────────────────────────

const shell = await readFile(SHELL_PATH, "utf8");

for (const page of pages) {
	const dir = page.route === "" ? DIST : join(DIST, page.route);
	await mkdir(dir, { recursive: true });
	await writeFile(
		join(dir, "index.html"),
		applyMeta(shell, { ...page, canonical: canonical(page.route) }, en.SEO.HOME.DESCRIPTION)
	);
}

// Genuinely unknown URLs should still 404, with the SPA as the body so that
// any client-side deep link without a file on disk (a subcategory page, or an
// article published since the last deploy) still renders for a real visitor.
// noindex on top: the 404 status already says so, but the body is also what
// a visitor's browser boots for those deep links.
await writeFile(
	join(DIST, "404.html"),
	applyMeta(
		shell,
		{
			title: en.SEO.NOT_FOUND.TITLE,
			description: en.SEO.NOT_FOUND.DESCRIPTION,
			canonical: canonical(""),
			noindex: true,
		},
		en.SEO.HOME.DESCRIPTION
	)
);

// ── sitemap ───────────────────────────────────────────────────────────
// Generated from the same list as the files above, so the sitemap can never
// claim a URL that doesn't exist (or miss one that does).
//
// URLs carry a trailing slash because that is the canonical form: GitHub Pages
// answers /about with a 301 to /about/, and a sitemap full of redirects wastes
// crawl budget and muddies which URL is authoritative. <PageMeta>'s canonical
// tag uses the same form.

const urlEntries = pages
	.map(({ route, lastmod }) => {
		const modified = lastmod ? `\n\t\t<lastmod>${lastmod}</lastmod>` : "";
		return `\t<url>\n\t\t<loc>${escapeHtml(canonical(route))}</loc>${modified}\n\t</url>`;
	})
	.join("\n");

await writeFile(
	join(DIST, "sitemap.xml"),
	`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		`${urlEntries}\n` +
		`</urlset>\n`
);

// ── rss feed ──────────────────────────────────────────────────────────
// Feed readers, aggregators and some crawlers discover new pieces through
// this well before the next sitemap crawl. index.html advertises it via
// <link rel="alternate" type="application/rss+xml">.

const feedItems = [...articles]
	.filter((a) => a.date_published)
	.sort((a, b) => b.date_published.localeCompare(a.date_published))
	.slice(0, FEED_ITEMS)
	.map((article) => {
		const link = canonical(`article/${article._id}`);
		const categoriesXml = [article.main_category, ...(article.sub_category ?? [])]
			.filter(Boolean)
			.map((c) => `\t\t\t<category>${escapeHtml(c)}</category>`)
			.join("\n");
		return (
			`\t\t<item>\n` +
			`\t\t\t<title>${escapeHtml(article.title)}</title>\n` +
			`\t\t\t<link>${escapeHtml(link)}</link>\n` +
			`\t\t\t<guid isPermaLink="true">${escapeHtml(link)}</guid>\n` +
			`\t\t\t<pubDate>${new Date(article.date_published).toUTCString()}</pubDate>\n` +
			(article.summary ? `\t\t\t<description>${escapeHtml(article.summary)}</description>\n` : "") +
			(categoriesXml ? `${categoriesXml}\n` : "") +
			`\t\t</item>`
		);
	})
	.join("\n");

await writeFile(
	join(DIST, "feed.xml"),
	`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
		`\t<channel>\n` +
		`\t\t<title>${escapeHtml(SITE_NAME)}</title>\n` +
		`\t\t<link>${siteUrl}/</link>\n` +
		`\t\t<description>${escapeHtml(en.SEO.HOME.DESCRIPTION)}</description>\n` +
		`\t\t<language>en-ca</language>\n` +
		`\t\t<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n` +
		`\t\t<atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />\n` +
		`\t\t<image>\n` +
		`\t\t\t<url>${siteUrl}${PUBLISHER_LOGO.path}</url>\n` +
		`\t\t\t<title>${escapeHtml(SITE_NAME)}</title>\n` +
		`\t\t\t<link>${siteUrl}/</link>\n` +
		`\t\t</image>\n` +
		`${feedItems}\n` +
		`\t</channel>\n` +
		`</rss>\n`
);

// macOS litter that would otherwise be published to the live site
await rm(join(DIST, ".DS_Store"), { force: true });

console.log(
	`prerendered ${pages.length} routes with per-route metadata ` +
		`(home, ${STATIC_ROUTES.length} static, ${categories.length} categories, ` +
		`${blogPosts.length} blog, ${articles.length} articles) + 404.html\n` +
		`sitemap.xml lists ${pages.length} URLs; feed.xml carries ${Math.min(FEED_ITEMS, articles.length)} items`
);
