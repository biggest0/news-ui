/**
 * SEO metadata: per-route canonical / robots / Open Graph, page-level
 * structured data, and the crawlable links that give search engines a path
 * to every article.
 *
 * These run against the client-side <PageMeta> in the preview build. The
 * prerendered per-route copies (what a crawler sees before hydration) are
 * produced by `npm run predeploy` and checked by inspecting dist/.
 */
import { test, expect } from "@playwright/test";
import { stubApi, useEnglish, dismissOnboarding } from "./support/stubApi";

const SITE = "https://www.catiretime.com";

test.beforeEach(async ({ page }) => {
	await useEnglish(page);
	await dismissOnboarding(page);
	await stubApi(page);
});

// ── canonical + robots ───────────────────────────────────────────────

test.describe("canonical and robots", () => {
	test("canonical points at the production URL with a trailing slash", async ({ page }) => {
		await page.goto("/about");
		const canonical = page.locator('head link[rel="canonical"]');
		await expect(canonical).toHaveAttribute("href", `${SITE}/about/`);
		await expect(canonical).toHaveCount(1);
		await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute(
			"content",
			`${SITE}/about/`
		);
	});

	test("search results drop the query from the canonical and are noindex", async ({ page }) => {
		await page.goto("/search?q=cats");
		await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
			"href",
			`${SITE}/search/`
		);
		await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", /noindex/);
	});

	test("the bare search page and content pages stay indexable", async ({ page }) => {
		await page.goto("/search");
		await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", /^index/);

		await page.goto("/science");
		await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", /^index/);
	});

	for (const path of ["/login", "/register", "/this-does-not-exist"]) {
		test(`${path} is noindex`, async ({ page }) => {
			await page.goto(path);
			await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", /noindex/);
			await expect(page.locator('head meta[name="robots"]')).toHaveCount(1);
		});
	}

	test("the language switch updates og:locale", async ({ page }) => {
		await page.goto("/about");
		await expect(page.locator('head meta[property="og:locale"]')).toHaveAttribute("content", "en_CA");

		await page.getByLabel("Language").click();
		await page.getByRole("menuitem", { name: /French/ }).click();
		await expect(page.locator('head meta[property="og:locale"]')).toHaveAttribute("content", "fr_CA");
	});
});

// ── article page ─────────────────────────────────────────────────────

test.describe("article page", () => {
	test("emits article Open Graph tags from the article data", async ({ page }) => {
		await page.goto("/article/art-001");

		await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute("content", "article");
		await expect(page.locator('head meta[property="article:published_time"]')).toHaveAttribute(
			"content",
			"2026-03-27T10:00:00.000Z"
		);
		await expect(page.locator('head meta[property="article:section"]')).toHaveAttribute(
			"content",
			"Politics"
		);
		await expect(page.locator('head meta[property="article:tag"]')).toHaveCount(2);
		await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
			"href",
			`${SITE}/article/art-001/`
		);
	});

	test("emits NewsArticle and BreadcrumbList JSON-LD that match the page", async ({ page }) => {
		await page.goto("/article/art-001");

		const script = page.locator('head script[data-seo="page"]');
		await expect(script).toHaveCount(1);
		const nodes = JSON.parse((await script.textContent()) ?? "[]") as Record<string, unknown>[];

		const article = nodes.find((n) => (n["@type"] as string[]).includes("NewsArticle"));
		expect(article).toBeDefined();
		expect(article?.["@type"]).toEqual(["NewsArticle", "SatiricalArticle"]);
		expect(article?.headline).toBe("Cat Mayor Declares International Nap Day");
		expect(article?.datePublished).toBe("2026-03-27T10:00:00.000Z");
		// the fixture has no author, so the markup carries the same fallback as the byline
		expect(article?.author).toEqual({ "@type": "Person", name: "Meowstein" });
		expect(article?.articleSection).toBe("Politics");

		const crumbs = nodes.find((n) => n["@type"] === "BreadcrumbList");
		const names = (crumbs?.itemListElement as { name: string }[]).map((i) => i.name);
		expect(names).toEqual(["Home", "Politics", "Cat Mayor Declares International Nap Day"]);
	});

	test("shows a breadcrumb trail linking back to the category", async ({ page }) => {
		await page.goto("/article/art-001");

		const trail = page.getByRole("navigation", { name: "Breadcrumb" });
		await expect(trail.getByRole("link", { name: "Politics" })).toHaveAttribute("href", "/politics");
		await expect(trail.getByText("Cat Mayor Declares International Nap Day")).toHaveAttribute(
			"aria-current",
			"page"
		);
	});

	test("ships the site-wide Organization graph exactly once", async ({ page }) => {
		await page.goto("/article/art-001");

		const site = page.locator('head script[data-seo="site"]');
		await expect(site).toHaveCount(1);
		const graph = JSON.parse((await site.textContent()) ?? "{}");
		const types = graph["@graph"].map((n: { "@type": string }) => n["@type"]);
		expect(types).toEqual(["Organization", "WebSite"]);
	});

	test("a missing article is a real not-found page, kept out of the index", async ({ page }) => {
		await page.route(/\/api\/articles\/[^/?]+(\?.*)?$/, (route) => {
			if (route.request().url().includes("/api/articles?")) return route.fallback();
			return route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
		});

		await page.goto("/article/does-not-exist");

		await expect(page.getByRole("heading", { level: 1 })).toHaveText("Article not found");
		await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", /noindex/);
		await expect(page).toHaveTitle(/Article not found \| Catire Time/);
	});
});

// ── crawlable links ──────────────────────────────────────────────────

test.describe("crawlable links", () => {
	test("feed headlines link to the article page", async ({ page }) => {
		await page.goto("/");
		// this headline is only in the feed fixture (not the featured one), so it appears once
		await page.getByRole("link", { name: "Fish Stocks Hit All-Time High After Cat Boycott" }).click();
		await expect(page).toHaveURL(/\/article\/art-002$/);
	});

	test("a card's category label links to the category page", async ({ page }) => {
		await page.goto("/");
		// exact + case-sensitive: the header CategoryBar renders BUSINESS in caps
		await page.getByRole("link", { name: "Business", exact: true }).first().click();
		await expect(page).toHaveURL(/\/business$/);
	});

	test("the masthead links home", async ({ page }) => {
		await page.goto("/about");
		await page.locator("div.hidden.md\\:flex").getByRole("link", { name: /ATIRE TIME/ }).click();
		await expect(page).toHaveURL("http://localhost:4173/");
	});
});
