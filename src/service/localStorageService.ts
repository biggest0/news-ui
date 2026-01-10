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

export function updateAppSettingInLocalStorage(
	key: string,
	value: string | number | boolean
) {
	try {
		const appConfig = localStorage.getItem("app_setting");
		const config = appConfig ? JSON.parse(appConfig) : {};
		config[key] = value;
		localStorage.setItem("app_setting", JSON.stringify(config));
	} catch (error) {
		console.error("Error updating app setting in localStorage:", error);
	}
}