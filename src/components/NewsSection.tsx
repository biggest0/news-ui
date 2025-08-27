import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

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
  const prevArticlesLength = useRef(0)
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [filteredArticles, setFilteredArticles] = useState(articles);

  const [page, setPage] = useState(1)
  const [showMore, setShowMore] = useState(true)
  const [fetching, setFetching] = useState(false)


  // load 10 articles when page initializes
	useEffect(() => {
		dispatch(getArticlesInfoByCategory({page: page, category: selectedCategory}));
	}, []);

  // logic to display articles of correct category
	useEffect(() => {
		if (selectedCategory === "all") {
			setFilteredArticles(articles);
		} else {
			setFilteredArticles(
				articles.filter((article) => article.mainCategory === selectedCategory)
			);
		}
	}, [selectedCategory, articles]);

  useEffect(() => {
    if (articles.length === prevArticlesLength.current) {
      setShowMore(false)
    }
    else {
      setShowMore(true)
      setFetching(false)
      prevArticlesLength. current = articles.length
    }
  }, [articles])

  // lazy loading more articles
	useEffect(() => {
		const handleScroll = () => {
			if (
        !fetching &&
        showMore &&
				window.innerHeight + window.scrollY >=
				document.body.scrollHeight - 100
			) {
        setFetching(true)
        setPage(prev => prev + 1)
        console.log(page)
        dispatch(getArticlesInfoByCategory({page: page + 1, category: selectedCategory}));
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, showMore]);

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
									dispatch(getArticlesInfoByCategory({page: page, category: category}));
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
