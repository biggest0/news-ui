import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { ARTICLE_ROUTES } from "@/constants/routes";
import type { AppDispatch } from "@/store/store";
import { loadArticlesInfoByCategory } from "@/store/articlesSlice";

export default function CategoryBar() {
	// get url/{category}
	const location = useLocation();
	const currentCategory = location.pathname.split("/")[1]; // grabs part after "/"

	const dispatch = useDispatch<AppDispatch>();
	// instead of setting the category, you link it
	// and then in sections just grab the param again and filter
	useEffect(() => {
		if (currentCategory === "") {
			// defaults to grabbing all articles
			dispatch(
				loadArticlesInfoByCategory({ page: 1, category: currentCategory })
			);
		} else if (ARTICLE_ROUTES.includes(currentCategory)) {
			dispatch(
				loadArticlesInfoByCategory({ page: 1, category: currentCategory })
			);
		}
	}, [currentCategory, dispatch]);

	return (
		<div>
			{/* article category menu slider */}
			<div className="w-full overflow-x-auto hide-scrollbar">
				<div className="flex border-b-2 border-gray-500 min-w-max md:justify-center">
					{ARTICLE_ROUTES.map((category, index) => (
						<Link
							key={category}
							to={{
								pathname: `/${category}`,
							}}
							className={`cursor-pointer pb-2 lg:pt-1 text-base md:text-lg font-medium whitespace-nowrap ${
								currentCategory === category
									? "border-b-2 border-blue-600 text-blue-600"
									: "text-gray-600 hover:text-black"
							} ${index !== 0 ? "ml-6" : ""}`}
						>
							{category.toUpperCase()}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
