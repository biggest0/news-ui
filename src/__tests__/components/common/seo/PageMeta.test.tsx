/**
 * PageMeta edits the head tags index.html already ships instead of rendering
 * new ones (see the component's docblock for why React 19's hoisting is the
 * wrong tool here). These tests seed a head the way the shell does and check
 * that every tag stays singular and route-specific.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import type { ReactElement } from "react";

import PageMeta from "@/components/common/seo/PageMeta";

const testI18n = i18n.createInstance();
testI18n.init({
	lng: "en",
	resources: {
		en: {
			translation: {
				SEO: { SITE_NAME: "Catire Time", HOME: { DESCRIPTION: "Site default description" } },
			},
		},
		fr: {
			translation: {
				SEO: { SITE_NAME: "Çatire Time", HOME: { DESCRIPTION: "Description par défaut" } },
			},
		},
	},
	interpolation: { escapeValue: false },
});

/** Renders under a router at `route` (PageMeta reads the location for the canonical). */
function renderMeta(ui: ReactElement, route = "/about") {
	return render(
		<MemoryRouter initialEntries={[route]}>
			<I18nextProvider i18n={testI18n}>{ui}</I18nextProvider>
		</MemoryRouter>
	);
}

const head = (selector: string) => document.head.querySelector(selector);
const content = (selector: string) => head(selector)?.getAttribute("content");

beforeEach(() => {
	// the tags index.html ships, in their default (home page) state
	document.head.innerHTML = [
		"<title>Default title</title>",
		'<meta name="description" content="default" />',
		'<meta name="robots" content="index, follow, max-image-preview:large" />',
		'<link rel="canonical" href="https://www.catiretime.com/" />',
		'<meta property="og:type" content="website" />',
		'<meta property="og:title" content="default" />',
		'<meta property="og:url" content="https://www.catiretime.com/" />',
	].join("");
	testI18n.changeLanguage("en");
});

describe("PageMeta", () => {
	it("sets the title with the site name appended, keeping a single <title>", () => {
		renderMeta(<PageMeta title="About" />);

		expect(document.title).toBe("About | Catire Time");
		expect(document.head.querySelectorAll("title")).toHaveLength(1);
	});

	it("updates the description in place and mirrors it to og/twitter", () => {
		renderMeta(<PageMeta title="About" description="Who we are" />);

		expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
		expect(content('meta[name="description"]')).toBe("Who we are");
		expect(content('meta[property="og:description"]')).toBe("Who we are");
		expect(content('meta[name="twitter:description"]')).toBe("Who we are");
		expect(content('meta[property="og:title"]')).toBe("About | Catire Time");
		expect(content('meta[name="twitter:title"]')).toBe("About | Catire Time");
	});

	it("falls back to the site description so a page never inherits the previous one", () => {
		renderMeta(<PageMeta title="About" />);

		expect(content('meta[name="description"]')).toBe("Site default description");
	});

	it("derives the canonical and og:url from the location, trailing slash and no query", () => {
		renderMeta(<PageMeta title="Search" />, "/search?q=cats");

		expect(head('link[rel="canonical"]')?.getAttribute("href")).toBe(
			"https://www.catiretime.com/search/"
		);
		expect(content('meta[property="og:url"]')).toBe("https://www.catiretime.com/search/");
		expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
	});

	it("lets a page override the canonical path", () => {
		renderMeta(<PageMeta title="X" path="/science" />, "/anything");

		expect(head('link[rel="canonical"]')?.getAttribute("href")).toBe(
			"https://www.catiretime.com/science/"
		);
	});

	it("indexes by default and switches to noindex,follow when asked", () => {
		const { rerender } = renderMeta(<PageMeta title="Login" />);
		expect(content('meta[name="robots"]')).toBe("index, follow, max-image-preview:large");

		rerender(
			<MemoryRouter initialEntries={["/login"]}>
				<I18nextProvider i18n={testI18n}>
					<PageMeta title="Login" noindex />
				</I18nextProvider>
			</MemoryRouter>
		);
		expect(content('meta[name="robots"]')).toBe("noindex, follow");
		expect(document.head.querySelectorAll('meta[name="robots"]')).toHaveLength(1);
	});

	it("uses the default share image with its dimensions", () => {
		renderMeta(<PageMeta title="About" />);

		expect(content('meta[property="og:image"]')).toBe("https://www.catiretime.com/og-image.jpg");
		expect(content('meta[property="og:image:width"]')).toBe("1200");
		expect(content('meta[property="og:image:height"]')).toBe("630");
		expect(content('meta[name="twitter:image"]')).toBe("https://www.catiretime.com/og-image.jpg");
	});

	it("emits article:* tags for articles and clears them again for a website page", () => {
		const { unmount } = renderMeta(
			<PageMeta
				title="Cats"
				type="article"
				article={{
					publishedTime: "2026-03-20T00:00:00.000Z",
					section: "Politics",
					tags: ["government", "cats"],
					author: "Meowstein",
				}}
			/>,
			"/article/abc"
		);

		expect(content('meta[property="og:type"]')).toBe("article");
		expect(content('meta[property="article:published_time"]')).toBe("2026-03-20T00:00:00.000Z");
		expect(content('meta[property="article:section"]')).toBe("Politics");
		expect(content('meta[property="article:author"]')).toBe("Meowstein");
		const tags = [...document.head.querySelectorAll('meta[property="article:tag"]')].map((el) =>
			el.getAttribute("content")
		);
		expect(tags).toEqual(["government", "cats"]);

		// navigate to a plain page: the article tags must not linger
		unmount();
		renderMeta(<PageMeta title="About" />);
		expect(content('meta[property="og:type"]')).toBe("website");
		expect(head('meta[property="article:published_time"]')).toBeNull();
		expect(document.head.querySelectorAll('meta[property="article:tag"]')).toHaveLength(0);
	});

	it("renders page JSON-LD into one script, replacing any prerendered block, and removes it on unmount", () => {
		// what a prerendered shell ships for its route
		const stale = document.createElement("script");
		stale.type = "application/ld+json";
		stale.dataset.seo = "page";
		stale.textContent = '{"stale":true}';
		document.head.appendChild(stale);
		// the site-wide graph, which PageMeta must never touch
		const site = document.createElement("script");
		site.type = "application/ld+json";
		site.dataset.seo = "site";
		document.head.appendChild(site);

		const { unmount } = renderMeta(
			<PageMeta title="Cats" jsonLd={{ "@type": "NewsArticle", headline: "Cats <3 boxes" }} />
		);

		const scripts = document.head.querySelectorAll('script[data-seo="page"]');
		expect(scripts).toHaveLength(1);
		expect(JSON.parse(scripts[0].textContent ?? "")).toEqual({
			"@type": "NewsArticle",
			headline: "Cats <3 boxes",
		});
		// "<" is escaped in the raw text so a headline can't close the script
		expect(scripts[0].textContent).not.toContain("<");
		expect(document.head.querySelectorAll('script[data-seo="site"]')).toHaveLength(1);

		unmount();
		expect(document.head.querySelectorAll('script[data-seo="page"]')).toHaveLength(0);
		expect(document.head.querySelectorAll('script[data-seo="site"]')).toHaveLength(1);
	});

	it("follows the UI language for og:locale", () => {
		testI18n.changeLanguage("fr");
		renderMeta(<PageMeta title="À propos" />);

		expect(document.title).toBe("À propos | Çatire Time");
		expect(content('meta[property="og:locale"]')).toBe("fr_CA");
		expect(content('meta[property="og:locale:alternate"]')).toBe("en_CA");
	});
});
