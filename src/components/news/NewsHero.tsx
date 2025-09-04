import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import Image from "@/assets/ChatGPT Image Apr 13, 2025, 11_38_22 AM.png";
import type { RootState, AppDispatch } from "@/store/store";
import { loadTopTenArticles } from "@/store/articlesSlice";
import NewsHeroCard from "./NewsHeroCard";

export default function NewsHero() {
	const dispatch = useDispatch<AppDispatch>();
	const { topTenArticles, loading, error } = useSelector(
		(state: RootState) => state.article
	);

	useEffect(() => {
		dispatch(loadTopTenArticles());
	}, []);
	return (
		<>
			<div className="grid grid-cols-4 grid-rows-2 gap-4 border-b border-gray-400 h-112 py-6">
				{/* Left column - 2 articles */}
				<div className="col-span-1 row-span-2 flex flex-col gap-2 overflow-hidden">
					{topTenArticles &&
						topTenArticles
							.slice(0, 2)
							.map((article) => (
								<NewsHeroCard
									key={`top-${article.id}`}
									articleInfo={article}
									small={false}
								/>
							))}
				</div>

				{/* Image - spans 2x2 */}
				<div className="col-span-2 row-span-2 relative overflow-hidden">
					<img
						src={Image}
						alt="Featured News"
						className="w-full h-full object-cover"
					/>
					<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white text-xl font-bold">
						"Reading satire news is like getting your veggies in cake
						form—tasty, fun, and surprisingly informative." — Albert Mewstein
					</div>
				</div>

				{/* Right column - multiple articles with scroll */}
				<div className="col-span-1 row-span-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
					{topTenArticles &&
						topTenArticles
							.slice(2, 6)
							.map((article) => (
								<NewsHeroCard
									key={`top-${article.id}`}
									articleInfo={article}
									small={true}
								/>
							))}
				</div>
			</div>
		</>
	);
}
