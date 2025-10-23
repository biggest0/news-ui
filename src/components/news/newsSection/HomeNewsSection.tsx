import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";
import { loadArticlesInfo } from "@/store/articlesSlice";
import { BaseNewsSection } from "./BaseNewsSection";
import type { ArticleInfoRequest } from "@/types/articleTypes";

export function HomeNewsSection() {
	const dispatch = useDispatch<AppDispatch>();
	const { homeArticles } = useSelector((state: RootState) => state.article);

	const loadMoreArticles = (request: ArticleInfoRequest) => {
		dispatch(loadArticlesInfo(request));
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
