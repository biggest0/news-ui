/**
 * Every URL the app owns, in one place.
 *
 * Split into three groups because they are consumed differently:
 *
 * - `PAGE_ROUTES` holds paths with no parameters. Safe to use directly in both
 *   `<Route path>` and `<Link to>`.
 * - `ROUTE_PATTERNS` holds paths with parameters. These are for `<Route path>`
 *   only. Never link to one: a `<Link to={ROUTE_PATTERNS.ARTICLE}>` navigates
 *   to the literal string "/article/:id".
 * - The `*Path()` builders fill a pattern in, and are what links and
 *   `navigate()` calls should use.
 *
 * Adding a route means adding it here first, then wiring it in `App.tsx`. If it
 * should be indexable, also add it (with its `SEO.*` key) to `STATIC_ROUTES` in
 * `scripts/prerenderRoutes.mjs` so it gets a real file on disk with its own
 * metadata, otherwise it 404s for crawlers and anyone opening the link directly.
 */

/** Paths with no parameters. Usable as-is in `<Route path>` and `<Link to>`. */
export const PAGE_ROUTES = {
	HOME: "/",
	ABOUT: "/about",
	CONTACT: "/contact",
	DISCLAIMER: "/disclaimer",
	PRIVACY: "/privacy",
	SEARCH: "/search",
	BLOG: "/blog",
	ACCOUNT: "/account",
	LOGIN: "/login",
	REGISTER: "/register",
	VERIFY_EMAIL: "/account/verification",
	RESET_PASSWORD: "/reset-password",
	GOOGLE_CALLBACK: "/auth/google/callback",
	// CATS: "/cats", not built yet. Uncomment when the route exists in
	// App.tsx, and add { route: "cats", seoKey: "CATS" } to STATIC_ROUTES in
	// scripts/prerenderRoutes.mjs so it gets a real file on disk. Until then /cats correctly 404s.
} as const;

/**
 * Paths with parameters, for `<Route path>` only. Build links with the
 * `*Path()` helpers below so the pattern and the link can never disagree.
 */
export const ROUTE_PATTERNS = {
	ARTICLE: "/article/:id",
	SUBCATEGORY: "/subcategory/:subCategory",
	BLOG_POST: "/blog/:slug",
	NEW_PASSWORD: "/reset-password/:token",
} as const;

/**
 * Article category slugs. Kept as a plain array literal because
 * `scripts/prerenderRoutes.mjs` parses it straight out of this file rather
 * than keeping a second copy that could drift.
 */
export const ARTICLE_ROUTES = [
	"world",
	"lifestyle",
	"science",
	"technology",
	"business",
	"sport",
	"politics",
	"other",
] as const;

export type ArticleCategory = (typeof ARTICLE_ROUTES)[number];

/**
 * Type guard for a category slug coming from article data or the URL.
 * @param value - e.g. an article's `mainCategory`
 * @returns true when it is one of `ARTICLE_ROUTES`
 */
export const isArticleCategory = (value: string | undefined): value is ArticleCategory =>
	value !== undefined && (ARTICLE_ROUTES as readonly string[]).includes(value);

/**
 * Link target for a single article.
 * @param id - Article id
 * @returns e.g. `/article/0ca44d28-1e3a-494d-bfbb-23948b6d4e96`
 */
export const articlePath = (id: string): string =>
	ROUTE_PATTERNS.ARTICLE.replace(":id", encodeURIComponent(id));

/**
 * Link target for a sub-category listing. Sub-categories come from article
 * content and can contain spaces or accents, so the value is encoded.
 * @param subCategory - Sub-category name as it appears on the article
 * @returns e.g. `/subcategory/space%20travel`
 */
export const subCategoryPath = (subCategory: string): string =>
	ROUTE_PATTERNS.SUBCATEGORY.replace(":subCategory", encodeURIComponent(subCategory));

/**
 * Link target for a blog post.
 * @param slug - The post's `meta.slug`
 * @returns e.g. `/blog/four-cats-one-story`
 */
export const blogPostPath = (slug: string): string =>
	ROUTE_PATTERNS.BLOG_POST.replace(":slug", encodeURIComponent(slug));

/**
 * Link target for a category listing page.
 * @param category - One of `ARTICLE_ROUTES`
 * @returns e.g. `/science`
 */
export const categoryPath = (category: ArticleCategory): string => `/${category}`;

/**
 * Link target for a search, with the query pre-filled.
 * @param query - Raw search text, encoded here
 * @returns e.g. `/search?q=cats%20in%20space`
 */
export const searchPath = (query: string): string =>
	`${PAGE_ROUTES.SEARCH}?q=${encodeURIComponent(query)}`;
