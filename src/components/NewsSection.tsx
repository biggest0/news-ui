import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import type { RootState, AppDispatch } from "../store/store";
import {
	getArticleDetail,
	getArticlesInfo,
	getArticlesInfoByCategory,
} from "../store/articlesSlice";
import NewsCard from "./NewsCard";

export default function NewsSection() {
	const dispatch = useDispatch<AppDispatch>();
	const { articles, loading, error } = useSelector(
		(state: RootState) => state.article
	);
	const categories = [
		"all",
		"world",
		"lifestyle",
		"science",
		"technology",
		"business",
		"sport",
		"politics",
		"other",
	];
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [filteredArticles, setFilteredArticles] = useState(articles);

	useEffect(() => {
		dispatch(getArticlesInfo());
	}, []);

	useEffect(() => {
		if (selectedCategory === "all") {
			setFilteredArticles(articles);
		} else {
			setFilteredArticles(
				articles.filter((article) => article.mainCategory === selectedCategory)
			);
		}
	}, [selectedCategory, articles]);
	return (
		<>
			<div>
				{/* article category menu slider */}
				<div className="w-full overflow-x-auto hide-scrollbar p-4">
					<div className="flex gap-8 border-b border-gray-300 px-4 min-w-max md:justify-center">
						{categories.map((category) => (
							<div
								key={category}
								onClick={() => {
									setSelectedCategory(category);
									dispatch(getArticlesInfoByCategory(category));
								}}
								className={`cursor-pointer py-2 text-lg font-medium whitespace-nowrap ${
									selectedCategory === category
										? "border-b-2 border-blue-600 text-blue-600"
										: "text-gray-600 hover:text-black"
								}`}
							>
								{category.toUpperCase()}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* articles */}
			<div>
				{filteredArticles.length > 0 && (
					<div>
						{filteredArticles.map((article) => (
							<NewsCard
								key={`${selectedCategory}-${article.id}`}
								articleInfo={article}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
}
