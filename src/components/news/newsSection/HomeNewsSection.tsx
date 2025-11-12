import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";
import { loadArticlesInfo } from "@/store/articlesSlice";
import { BaseNewsSection } from "./BaseNewsSection";
import type { ArticleInfoRequest } from "@/types/articleTypes";
// import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";

export function HomeNewsSection() {
	const dispatch = useDispatch<AppDispatch>();
	const { homeArticles, loading } = useSelector(
		(state: RootState) => state.article
	);

	const loadMoreArticles = (request: ArticleInfoRequest) => {
		dispatch(loadArticlesInfo(request));
	};

	// const [_loadingPage, setLoading] = useState(true);

	// useEffect(() => {
	// 	const timer = setTimeout(() => setLoading(false), 2000); // simulate loading
	// 	return () => clearTimeout(timer);
	// }, []);

	return (
		<>
			<BaseNewsSection
				articles={homeArticles}
				loadMoreArticles={loadMoreArticles}
				resetKey={"home"}
			/>
			{<LoadingOverlay loading={loading.homePage}/>}
		</>
	);
}
