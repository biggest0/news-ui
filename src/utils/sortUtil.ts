import type { ArticleInfo } from "@/types/articleTypes";

export function sortArticlesByMatchCount(articles: ArticleInfo[], query: string) {
	const lowerCaseQuery = query.toLowerCase();

	return articles.sort((a, b) => {
		const countA =
			(a.title.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) || [])
				.length *
				2 +
			(a.summary?.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) || [])
				.length;
		const countB =
			(b.title.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) || [])
				.length *
				2 +
			(b.summary?.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) || [])
				.length;

		return countB - countA;
	});
}