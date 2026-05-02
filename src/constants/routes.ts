export const PAGE_ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	ABOUT: "/about",
	SEARCH: "/search",
	CATS: "/cats",
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
