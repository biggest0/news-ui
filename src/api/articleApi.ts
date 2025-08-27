import {
	articleDetailTransform,
	articleInfoTransform,
} from "../utils/transform";

export async function fetchArticlesByCategory(page: number, category: string) {
	const response = await fetch(
		`http://localhost:3001/article-info?page=${page}&limit=10&category=${category}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	const data = await response.json();
	return data.map(articleInfoTransform);
}

export async function fetchArticlesInfo() {
	const response = await fetch(
		"http://localhost:3001/article-info?page=1&limit=10",
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	const data = await response.json();
	return data.map(articleInfoTransform);
}

export async function fetchArticleDetail(articleId: string) {
	// console.log(111, articleId);
	const response = await fetch("http://localhost:3001/article-detail", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: articleId }),
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	const data = await response.json();
	// console.log(data);
	return articleDetailTransform(data);
}

export async function incrementArticleViewed(articleId: string) {
	fetch(`http://localhost:3001/increment-article-view/${articleId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
	});

	// if (!response.ok) {
	//   throw new Error(`Failed to update article: ${response.statusText}`);
	// }

	// no returns because just incrementing view of article with specific ID
}
