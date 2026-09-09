export const PAGE_ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	ABOUT: "/about",
	SEARCH: "/search",
	// CATS: "/cats", not built yet. Uncomment when the route exists in
	// App.tsx, and add "cats" to STATIC_ROUTES in scripts/prerenderRoutes.mjs so
	// it gets a real file on disk. Until then /cats correctly 404s.
	BLOG: "/blog",
};

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
