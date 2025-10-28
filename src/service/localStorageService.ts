import type { ArticleInfo } from "@/types/articleTypes";

export function handleLocalStorageUpdate(
	clickedArticle: ArticleInfo,
	articleHistory: ArticleInfo[],
	setArticleHistory: (articles: ArticleInfo[]) => void
) {
	const filterClickedArticle = articleHistory.filter(
		(a) => a.id !== clickedArticle.id
	);
	const updatedArticles = [clickedArticle, ...filterClickedArticle];
	setArticleHistory(updatedArticles.slice(0, 100));
}
