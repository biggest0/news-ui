import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";
import { loadArticlesInfo } from "@/store/articlesSlice";
import { BaseNewsSection } from "./BaseNewsSection";
import type { ArticleInfoQueryDTO } from "@/types/articleDto";
// import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/components/common/feedback/LoadingOverlay";
import CollapsibleSection from "../CollapsibleSection";

export function HomeNewsSection() {
	const dispatch = useDispatch<AppDispatch>();
	const { homeArticles, homeArticlesCount, loading } = useSelector(
		(state: RootState) => state.article
	);

	const loadMoreArticles = (request: ArticleInfoQueryDTO) => {
		dispatch(loadArticlesInfo(request));
	};

	// const [_loadingPage, setLoading] = useState(true);

	// useEffect(() => {
	// 	const timer = setTimeout(() => setLoading(false), 2000); // simulate loading
	// 	return () => clearTimeout(timer);
	// }, []);

	return (
		<>
			<CollapsibleSection>
				<BaseNewsSection
					articles={homeArticles}
					totalCount={homeArticlesCount}
					loadMoreArticles={loadMoreArticles}
					resetKey={"home"}
				/>
			</CollapsibleSection>
			{<LoadingOverlay loading={loading.homePage} />}
		</>
	);
}
