import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import type { RootState, AppDispatch } from "@/store/store";
import { loadArticlesInfoByCategory } from "@/store/articlesSlice";
import { BaseNewsSection } from "./BaseNewsSection";
import type { ArticleInfoRequest } from "@/types/articleTypes";

export function CategoryNewsSection() {
	const dispatch = useDispatch<AppDispatch>();
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];
	const { articles } = useSelector((state: RootState) => state.article);
	const [filteredArticles, setFilteredArticles] = useState(articles);

	// Filter articles by category
	useEffect(() => {
		setFilteredArticles(
			articles.filter((article) => article.mainCategory === selectedCategory)
		);
	}, [selectedCategory, articles]);

	const loadMoreArticles = (request: ArticleInfoRequest) => {
		if (request.page) {
			dispatch(
				// using a separate route because store structure is different for category articles and home page articles
				// maybe find a better way to structure this in the future
				loadArticlesInfoByCategory({
					page: request.page,
					category: selectedCategory,
				})
			);
		}
	};

	return (
		<BaseNewsSection
			articles={filteredArticles}
			loadMoreArticles={loadMoreArticles}
			resetKey={selectedCategory}
		/>
	);
}
