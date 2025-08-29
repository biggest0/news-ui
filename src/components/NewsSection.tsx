import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import type { RootState, AppDispatch } from "../store/store";
import {
	loadArticlesInfoByCategory,
} from "../store/articlesSlice";
import NewsCard from "./NewsCard";
import { useLocation } from "react-router-dom";

export default function NewsSection() {
	const location = useLocation()
	const selectedCategory = location.pathname.split('/')[1]
	const dispatch = useDispatch<AppDispatch>();
	const { articles, loading, error } = useSelector(
		(state: RootState) => state.article
	);
  const prevArticlesLength = useRef(0)
	// const [selectedCategory, setSelectedCategory] = useState("all");
	const [filteredArticles, setFilteredArticles] = useState(articles);

  const [page, setPage] = useState(1)
  const [showMore, setShowMore] = useState(true)
  const [fetching, setFetching] = useState(false)


  // // load 10 articles when page initializes
	// useEffect(() => {
	// 	dispatch(loadArticlesInfoByCategory({page: page, category: selectedCategory}));
	// }, []);

  // logic to display articles of correct category
	useEffect(() => {
		if (selectedCategory === "") {
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
        dispatch(loadArticlesInfoByCategory({page: page + 1, category: selectedCategory}));
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, showMore]);

	return (
		<div>


			{/* articles */}

				{filteredArticles.length > 0 && (
					<div>
						{filteredArticles.map((article) => (
							<NewsCard
								key={`${selectedCategory || 'all'}-${article.id}`}
								articleInfo={article}
							/>
						))}
					</div>
				)}

		</div>
	);
}
