/**
 * JSON-LD builders. The shapes matter more than the values: Google's Article
 * and BreadcrumbList rich results depend on these exact property names.
 */
import { describe, it, expect } from "vitest";
import {
	blogPostingJsonLd,
	breadcrumbJsonLd,
	newsArticleJsonLd,
} from "@/utils/seo/structuredData";

const articleInput = {
	url: "https://www.catiretime.com/article/abc/",
	headline: "Cat Takes Over Parliament",
	datePublished: "2026-03-20T00:00:00.000Z",
	author: "Meowstein",
	imageUrl: "https://www.catiretime.com/og-image.jpg",
	language: "en",
};

describe("newsArticleJsonLd", () => {
	it("is typed as both NewsArticle and SatiricalArticle", () => {
		const node = newsArticleJsonLd(articleInput);
		expect(node["@context"]).toBe("https://schema.org");
		expect(node["@type"]).toEqual(["NewsArticle", "SatiricalArticle"]);
	});

	it("carries the headline, date, author and an inlined publisher with a logo", () => {
		const node = newsArticleJsonLd(articleInput);
		expect(node.headline).toBe("Cat Takes Over Parliament");
		expect(node.datePublished).toBe("2026-03-20T00:00:00.000Z");
		expect(node.mainEntityOfPage).toBe(articleInput.url);
		expect(node.author).toEqual({ "@type": "Person", name: "Meowstein" });
		expect(node.image).toEqual([articleInput.imageUrl]);
		expect(node.inLanguage).toBe("en");

		const publisher = node.publisher as Record<string, unknown>;
		expect(publisher["@type"]).toBe("Organization");
		expect(publisher.name).toBe("Catire Time");
		expect((publisher.logo as Record<string, unknown>).url).toBe(
			"https://www.catiretime.com/images/logo-512.png"
		);
	});

	it("omits optional fields the article doesn't have", () => {
		const node = newsArticleJsonLd(articleInput);
		expect(node).not.toHaveProperty("description");
		expect(node).not.toHaveProperty("articleSection");
		expect(node).not.toHaveProperty("keywords");
	});

	it("includes description, section and keywords when present", () => {
		const node = newsArticleJsonLd({
			...articleInput,
			description: "A tabby seized control",
			section: "Politics",
			keywords: ["government", "cats"],
		});
		expect(node.description).toBe("A tabby seized control");
		expect(node.articleSection).toBe("Politics");
		expect(node.keywords).toEqual(["government", "cats"]);
	});

	it("drops an empty keywords list rather than emitting []", () => {
		const node = newsArticleJsonLd({ ...articleInput, keywords: [] });
		expect(node).not.toHaveProperty("keywords");
	});
});

describe("breadcrumbJsonLd", () => {
	it("numbers the crumbs from 1 and resolves paths to canonical URLs", () => {
		const node = breadcrumbJsonLd([
			{ name: "Home", path: "/" },
			{ name: "Science", path: "/science" },
			{ name: "Cats Teleport", path: "/article/abc" },
		]);
		expect(node["@type"]).toBe("BreadcrumbList");
		expect(node.itemListElement).toEqual([
			{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.catiretime.com/" },
			{ "@type": "ListItem", position: 2, name: "Science", item: "https://www.catiretime.com/science/" },
			{
				"@type": "ListItem",
				position: 3,
				name: "Cats Teleport",
				item: "https://www.catiretime.com/article/abc/",
			},
		]);
	});
});

describe("blogPostingJsonLd", () => {
	const input = {
		url: "https://www.catiretime.com/blog/welcome/",
		headline: "Welcome",
		description: "First post",
		imageUrl: "https://www.catiretime.com/og-image.jpg",
	};

	it("is a BlogPosting authored and published by the organisation", () => {
		const node = blogPostingJsonLd({ ...input, datePublished: "2026-08-18", keywords: ["about"] });
		expect(node["@type"]).toBe("BlogPosting");
		expect(node.datePublished).toBe("2026-08-18");
		expect(node.keywords).toEqual(["about"]);
		expect((node.author as Record<string, unknown>)["@type"]).toBe("Organization");
	});

	it("omits datePublished when the post date could not be parsed", () => {
		const node = blogPostingJsonLd(input);
		expect(node).not.toHaveProperty("datePublished");
	});
});
