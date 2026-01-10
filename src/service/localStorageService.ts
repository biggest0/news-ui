import type { ArticleInfo } from "@/types/articleTypes";
import type {
	ExpandedSections,
	VisibleSections,
} from "@/types/localStorageTypes";
import {
	getAppSetting,
	setAppSetting,
} from "@/utils/storage/localStorageUtils";

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

export function updateSectionVisibility(
	key: keyof VisibleSections,
	value: boolean
) {
	try {
		const appSetting = getAppSetting();
		appSetting.homeLayout.visible[key] = value;
		setAppSetting(appSetting);
	} catch (error) {
		console.error("Error updating app setting in localStorage:", error);
	}
}

export function updateSectionExpansion(
	key: keyof ExpandedSections,
	value: boolean
) {
	try {
		const appSetting = getAppSetting();
		appSetting.homeLayout.expanded[key] = value;
		setAppSetting(appSetting);
	} catch (error) {
		console.error("Error updating app setting in localStorage:", error);
	}
}

export function toggleDarkMode() {
	try {
		const appSetting = getAppSetting();
		appSetting.darkMode = !appSetting.darkMode;
		setAppSetting(appSetting);
	} catch (error) {
		console.error("Error toggling dark mode in localStorage:", error);
	}
}

export function togglePagePagination() {
	try {
		const appSetting = getAppSetting();
		const pagePagination = appSetting.homeLayout.pagePagination;
		appSetting.homeLayout.pagePagination = !pagePagination;
		setAppSetting(appSetting);
	} catch (error) {
		console.error("Error toggling news section view in localStorage:", error);
	}
}
