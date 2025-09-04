import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import type { RootState, AppDispatch } from "@/store/store";
import { loadTopTenArticles } from "@/store/articlesSlice";

export default function TopArticles() {
	const dispatch = useDispatch<AppDispatch>();
	const { topTenArticles, loading, error } = useSelector(
		(state: RootState) => state.article
	);

	useEffect(() => {
		dispatch(loadTopTenArticles());
	}, []);

	return (
		// <>
		// 	<div className="grid grid-cols-4 gap-3 mb-16 border-b-2 border-gray-200">
		// 		{/* Big Image - spans 2x3 */}
		// 		<div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden">
		// 			<img
		// 				src={Image}
		// 				alt="Featured News"
		// 				className="w-full h-full object-cover"
		// 			/>
		// 			<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white text-xl font-bold">
		// 				"Reading satire news is like getting your veggies in cake
		// 				form—tasty, fun, and surprisingly informative." — Albert Mewstein
		// 			</div>
		// 		</div>

		// 		{topTenArticles &&
		// 			topTenArticles.map((article) => (
		// 				<NewsCard key={`top-${article.id}`} articleInfo={article} />
		// 			))}
		// 	</div>
		// </>
		<div className="border-b border-gray-400 py-4">
			<div className="grid grid-cols-5 grid-rows-2 gap-4">
				{topTenArticles.map((article, index) => (
					<div
						className="font-medium hover:text-amber-600 cursor-pointer"
						key={`top-ten-${article.id}`}
					>
						{index + 1 + ". " + article.title}
					</div>
				))}
			</div>
		</div>
	);
}
