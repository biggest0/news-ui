import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import type { RootState, AppDispatch } from "@/store/store";
import { loadArticlesInfoByCategory } from "@/store/articlesSlice";
import NewsCard from "./NewsCard";
import NewsSideColumn from "./NewsSideColumn";
import { EditorCardVertical } from "@/components/sideColumn/EditorCardVertical";
import { CATIRE_EDITORS, CAT_FACTS } from "@/components/sideColumn/constants";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CatFactsCard } from "@/components/sideColumn/CatFactsCard";
import { isWithinNDays } from "@/service/dateUtils";

export default function NewsSection() {
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];
	const dispatch = useDispatch<AppDispatch>();
	const { articles } = useSelector((state: RootState) => state.article);
	const prevArticlesLength = useRef(0);
	const [filteredArticles, setFilteredArticles] = useState(articles);

	const [page, setPage] = useState(1);
	const [showMore, setShowMore] = useState(true);
	const [fetching, setFetching] = useState(false);
	const [dateRange, setDateRange] = useState("");
	const [sortBy, setSortBy] = useState("");

	// // Manual article filtering
	// useEffect(() => {
	// 	let searchedArticles = [...filteredArticles];
	// 	if (dateRange) {
	// 		switch (dateRange) {
	// 			case "24h":
	// 				searchedArticles = filteredArticles.filter((article) => {
	// 					if (article.datePublished) {
	// 						return isWithinNDays(article.datePublished, 1);
	// 					}
	// 				});
	// 				break;
	// 			case "7d":
	// 				searchedArticles = filteredArticles.filter((article) => {
	// 					if (article.datePublished) {
	// 						return isWithinNDays(article.datePublished, 7);
	// 					}
	// 				});
	// 				break;
	// 			case "30d":
	// 				searchedArticles = filteredArticles.filter((article) => {
	// 					if (article.datePublished) {
	// 						return isWithinNDays(article.datePublished, 30);
	// 					}
	// 				});
	// 		}

	// 		if (sortBy) {
	// 			switch (sortBy) {
	// 				case "newest":
	// 					searchedArticles = filteredArticles.sort((a, b) => {
	// 						if (b.datePublished && a.datePublished) {
	// 							return (
	// 								new Date(b.datePublished).getTime() -
	// 								new Date(a.datePublished).getTime()
	// 							);
	// 						}
	// 						return 0;
	// 					});
	// 					break;
	// 			}
	// 		}
	// 		setFilteredArticles(searchedArticles);
	// 	}
	// }, [dateRange, sortBy, articles, filteredArticles]);

	// Logic to display articles of correct category
	useEffect(() => {
		if (selectedCategory === "") {
			setFilteredArticles(articles);
		} else {
			setFilteredArticles(
				articles.filter((article) => article.mainCategory === selectedCategory)
			);
		}
	}, [selectedCategory, articles]);

	// Check if more articles to load
	useEffect(() => {
		if (articles.length === prevArticlesLength.current) {
			setShowMore(false);
		} else {
			setShowMore(true);
			setFetching(false);
			prevArticlesLength.current = articles.length;
		}
	}, [articles]);

	// Lazy loading more articles
	useEffect(() => {
		const handleScroll = () => {
			if (
				!fetching &&
				showMore &&
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 100
			) {
				setFetching(true);
				setPage((prev) => prev + 1);
				dispatch(
					loadArticlesInfoByCategory({
						page: page + 1,
						category: selectedCategory,
					})
				);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, showMore]);

	return (
		<div className="flex flex-col md:grid md:grid-cols-3 gap-x-4 gap-y-6 pt-6">
			{selectedCategory === "" && (
				<>
					{/* Horizontal col for mobile screen for home page */}
					<section className="md:hidden pb-6 border-b border-gray-400">
						<SectionHeader title="OUR EDITORS" />
						<div className="flex flex-row overflow-x-auto hide-scrollbar space-x-4">
							{/* List of editors*/}
							{CATIRE_EDITORS.map((editor, index) => (
								<EditorCardVertical
									key={`editor-${index}`}
									name={editor.name}
									role={editor.role}
									description={editor.description}
									imageUrl={editor.imageUrl}
								/>
							))}
						</div>
					</section>

					{/* Horizontal col for cat facts for home page */}
					<section className="md:hidden pb-6 border-b border-gray-400">
						<SectionHeader title="CAT FACTS" />
						<div className="flex w-full gap-4 overflow-x-auto pt-4 hide-scrollbar">
							{CAT_FACTS.map((catFact, index) => (
								<CatFactsCard
									key={index}
									title={catFact.title}
									fact={catFact.fact}
									small={true}
								/>
							))}
						</div>
					</section>
				</>
			)}

			{/* Articles, main col */}
			<section className="md:col-span-2">
				<div className="flex flex-row justify-between w-full items-center">
					<SectionHeader title="MEWS" />

					{/* Filter bar */}
					<div className="flex gap-8 pb-4 text-sm text-gray-600">
						{/* Date Range */}
						<select
							value={dateRange}
							className="py-1 font-medium text-gray-700"
							onChange={(e) => setDateRange(e.target.value)}
						>
							<option value="" disabled>
								Date Range
							</option>
							<option value="all">All Time</option>
							<option value="24h">Last 24 hours</option>
							<option value="7d">Last 7 days</option>
							<option value="30d">Last 30 days</option>
						</select>

						{/* Sort By */}
						<select
							value={sortBy}
							className=" py-1 font-medium text-gray-700"
							onChange={(e) => setSortBy(e.target.value)}
						>
							<option value="" disabled hidden>
								Sort By
							</option>
							<option value="newest">Newest</option>
						</select>
					</div>
				</div>
				
				{filteredArticles.length > 0 && (
					<div>
						{filteredArticles.map((article) => (
							<NewsCard
								key={`${selectedCategory || "all"}-${article.id}`}
								articleInfo={article}
							/>
						))}
					</div>
				)}
			</section>

			{/* Side col for md screen and larger */}
			<div className="hidden md:flex flex-col space-y-6 pl-4 border-l border-gray-400">
				<NewsSideColumn />
			</div>
		</div>
	);
}
