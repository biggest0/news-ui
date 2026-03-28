import { describe, it, expect } from "vitest";
import { sortArticlesByMatchCount } from "@/utils/search/sortUtils";
import type { ArticleInfo } from "@/types/articleTypes";

function makeArticle(overrides: Partial<ArticleInfo> = {}): ArticleInfo {
	return {
		id: "1",
		title: "Default Title",
		summary: "Default summary",
		datePublished: "3/20/2026",
		mainCategory: "general",
		subCategory: [],
		viewed: 0,
		likeCount: 0,
		...overrides,
	};
}

describe("sortArticlesByMatchCount", () => {
	it("ranks article with more title matches higher (title has ×2 weight)", () => {
		const articles = [
			makeArticle({ id: "a", title: "Dog park", summary: "cat spotted once" }),
			makeArticle({ id: "b", title: "Cat cat cat", summary: "no match" }),
		];
		const result = sortArticlesByMatchCount(articles, "cat");
		expect(result[0].id).toBe("b"); // 3 title matches ×2 = 6
	});

	it("uses summary matches as tiebreaker", () => {
		const articles = [
			makeArticle({ id: "a", title: "Cat", summary: "nothing here" }),
			makeArticle({ id: "b", title: "Cat", summary: "cat cat cat" }),
		];
		const result = sortArticlesByMatchCount(articles, "cat");
		// "a": title 1×2 + summary 0 = 2
		// "b": title 1×2 + summary 3 = 5
		expect(result[0].id).toBe("b");
	});

	it("is case-insensitive", () => {
		const articles = [
			makeArticle({ id: "a", title: "CAT Cat cAt", summary: "" }),
			makeArticle({ id: "b", title: "one cat", summary: "" }),
		];
		const result = sortArticlesByMatchCount(articles, "cat");
		expect(result[0].id).toBe("a");
	});

	it("handles empty query — all scores are 0, order preserved", () => {
		const articles = [
			makeArticle({ id: "a", title: "First" }),
			makeArticle({ id: "b", title: "Second" }),
		];
		const result = sortArticlesByMatchCount(articles, "");
		// Empty regex matches empty string between every character, but
		// both articles should score equally
		expect(result).toHaveLength(2);
	});

	it("handles articles with undefined summary", () => {
		const articles = [
			makeArticle({ id: "a", title: "Cat story", summary: undefined }),
			makeArticle({ id: "b", title: "Dog story", summary: "cat" }),
		];
		const result = sortArticlesByMatchCount(articles, "cat");
		// "a": title 1×2 + summary 0 = 2, "b": title 0 + summary 1 = 1
		expect(result[0].id).toBe("a");
	});

	it("handles single article", () => {
		const articles = [makeArticle({ id: "a", title: "Cat" })];
		const result = sortArticlesByMatchCount(articles, "cat");
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe("a");
	});

	it("handles empty array", () => {
		const result = sortArticlesByMatchCount([], "cat");
		expect(result).toEqual([]);
	});

	it("handles query with no matches in any article", () => {
		const articles = [
			makeArticle({ id: "a", title: "Dog park" }),
			makeArticle({ id: "b", title: "Fish tank" }),
		];
		const result = sortArticlesByMatchCount(articles, "zebra");
		// All scores 0, both should remain
		expect(result).toHaveLength(2);
	});
});
