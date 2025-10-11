import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { loadArticlesInfo } from "@/store/articlesSlice";
import { BaseNewsSection } from "./BaseNewsSection";

export function HomeNewsSection() {
	const dispatch = useDispatch<AppDispatch>();
	const { homeArticles } = useSelector((state: RootState) => state.article);

	const loadMoreArticles = (page: number) => {
		dispatch(loadArticlesInfo(page));
	};

	return (
		<BaseNewsSection
			articles={homeArticles}
			loadMoreArticles={loadMoreArticles}
			showHomeContent={true}
			resetKey={"home"}
		/>
	);
}
