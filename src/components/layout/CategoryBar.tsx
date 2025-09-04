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
	useEffect(() => {
		dispatch(
			loadArticlesInfoByCategory({ page: 1, category: currentCategory })
		);
	}, [currentCategory]);

	return (
		<div>
			{/* article category menu slider */}
			<div className="w-full overflow-x-auto hide-scrollbar pt-4">
				<div className="flex gap-8 border-b border-gray-400 px-4 min-w-max md:justify-center">
					{ARTICLE_ROUTES.map((category) => (
						<Link
							key={category}
							to={{
								pathname: `/${category}`,
							}}
							className={`cursor-pointer py-2 text-lg font-medium whitespace-nowrap ${
								currentCategory === category
									? "border-b-2 border-blue-600 text-blue-600"
									: "text-gray-600 hover:text-black"
							}`}
						>
							{category.toUpperCase()}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

// instead of setting the category, you link it
// and then in sections just grab the param again and filter
