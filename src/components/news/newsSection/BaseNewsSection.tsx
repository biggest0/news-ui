import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import NewsCard from "../NewsCard";
import NewsSideColumn from "../NewsSideColumn";
import { EditorCardVertical } from "@/components/sideColumn/EditorCardVertical";
import { CATIRE_EDITORS, CAT_FACTS } from "@/components/sideColumn/constants";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CatFactsCard } from "@/components/sideColumn/CatFactsCard";
import type { ArticleInfo } from "@/types/articleTypes";
import { isWithinNDays } from "@/service/dateUtils";
import type { ArticleInfoRequest } from "@/types/articleTypes";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { USER_ARTICLE_HISTORY } from "@/constants/keys";
import type { RootState } from "@/store/store";

interface BaseNewsSectionProps {
	articles: ArticleInfo[];
	loadMoreArticles: (request: ArticleInfoRequest) => void;
	showHomeContent?: boolean;
	resetKey?: string;
}

export function BaseNewsSection({
	articles,
	loadMoreArticles,
	showHomeContent = false,
	resetKey,
}: BaseNewsSectionProps) {
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];
	const prevArticlesLength = useRef(0);
	const { loadingArticleInfo } = useSelector(
		(state: RootState) => state.article
	);

	const [articlesToDisplay, setArticlesToDisplay] = useState(articles);
	const [page, setPage] = useState(1);
	const [showMore, setShowMore] = useState(true);
	const [fetching, setFetching] = useState(false);
	const [dateRange, setDateRange] = useState("all");
	const [sortBy, setSortBy] = useState("newest");
	const [articleHistory, setArticleHistory] = useLocalStorage<ArticleInfo[]>(
		USER_ARTICLE_HISTORY,
		[]
	);

	const handleLocalStorageUpdate = (clickedArticle: ArticleInfo) => {
		// Maintain a max of 100 articles in history
		if (articleHistory.length === 100) {
			articleHistory.pop();
		}
		// Check if article already exists in history
		if (!articleHistory.some((a) => a.id === clickedArticle.id)) {
			const updatedArticles = [clickedArticle, ...articleHistory];
			setArticleHistory(updatedArticles);
		} else {
			// Move the clicked article to the front
			const filteredArticles = articleHistory.filter(
				(a) => a.id !== clickedArticle.id
			);
			const updatedArticles = [clickedArticle, ...filteredArticles];
			setArticleHistory(updatedArticles);
		}
	};

	// Reset state when component mounts or resetKey changes
	useEffect(() => {
		prevArticlesLength.current = 0;
		setShowMore(true);
		setFetching(false);
	}, [resetKey]);

	// Check if more articles to load
	useEffect(() => {
		if (articlesToDisplay.length === prevArticlesLength.current) {
			setShowMore(false);
		} else {
			// console.log("ran");
			setShowMore(true);
			setFetching(false);
			prevArticlesLength.current = articlesToDisplay.length;
		}
	}, [articlesToDisplay]);

	// Update page count based on articles length
	useEffect(() => {
		if (articles.length > 0) {
			setPage(Math.ceil(articles.length / 10));
		}
	}, [articles]);

	// useEffect(() => {
	// 	console.log(page, showMore, fetching);
	// });

	// Lazy loading more articles
	useEffect(() => {
		const handleScroll = () => {
			if (
				!fetching &&
				showMore &&
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 700
			) {
				setFetching(true);
				setPage((prev) => prev + 1);
				loadMoreArticles({ page: page + 1, category: selectedCategory });
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, showMore, page, loadMoreArticles]);

	// Filter articles when dateRange or sortBy changes
	useEffect(() => {
		let tempArticles = [...articles];
		if (dateRange) {
			switch (dateRange) {
				case "24h":
					tempArticles = tempArticles.filter((article) => {
						if (article.datePublished) {
							return isWithinNDays(article.datePublished, 1);
						}
					});
					break;
				case "7d":
					tempArticles = tempArticles.filter((article) => {
						if (article.datePublished) {
							return isWithinNDays(article.datePublished, 7);
						}
					});
					break;
				case "30d":
					tempArticles = tempArticles.filter((article) => {
						if (article.datePublished) {
							return isWithinNDays(article.datePublished, 30);
						}
					});
			}
		}
		if (sortBy) {
			switch (sortBy) {
				case "newest":
					tempArticles = tempArticles.sort((a, b) => {
						if (b.datePublished && a.datePublished) {
							return (
								new Date(b.datePublished).getTime() -
								new Date(a.datePublished).getTime()
							);
						}
						return 0;
					});
					break;
				case "mostViewed":
					tempArticles = tempArticles.sort((a, b) => {
						return (b.viewed || 0) - (a.viewed || 0);
					});
					break;
			}
		}

		// Compare tempArticles with articlesToDisplay before setting state
		const currentIds = articlesToDisplay.map((a) => a.id);
		const newIds = tempArticles.map((a) => a.id);

		let articlesAreDifferent = false;
		if (currentIds.length !== newIds.length) {
			articlesAreDifferent = true;
		} else {
			articlesAreDifferent = currentIds.some(
				(id, index) => id !== newIds[index]
			);
		}
		if (articlesAreDifferent) {
			setArticlesToDisplay(tempArticles);
		}
	}, [dateRange, sortBy, articles]);

	return (
		<div className="flex flex-col md:grid md:grid-cols-3 gap-x-4 gap-y-6 pt-6">
			{showHomeContent && <HomeContentSections />}

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
							onChange={(e) => {
								setDateRange(e.target.value);
								prevArticlesLength.current = 0;
							}}
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
							className="py-1 font-medium text-gray-700"
							onChange={(e) => {
								setSortBy(e.target.value);
								prevArticlesLength.current = 0;
							}}
						>
							<option value="" disabled>
								Sort By
							</option>
							<option value="newest">Newest</option>
							<option value="mostViewed">Most Viewed</option>
						</select>
					</div>
				</div>

				{articlesToDisplay.length > 0 && (
					<div>
						{articlesToDisplay.map((article) => (
							<NewsCard
								key={article.id}
								articleInfo={article}
								onRead={handleLocalStorageUpdate}
							/>
						))}
					</div>
				)}

				<div className="text-center text-gray-500 py-4">
					{loadingArticleInfo
						? "Just a few seoncds, articles are coming!"
						: "You've scrolled to the end. There's nothing left!"}
				</div>
			</section>

			{/* Side col for md screen and larger */}
			<div className="hidden md:flex flex-col space-y-6 pl-4 border-l border-gray-400">
				<NewsSideColumn />
			</div>
		</div>
	);
}

// HomeContentSections component
function HomeContentSections() {
	return (
		<>
			{/* Horizontal col for mobile screen for home page */}
			<section className="md:hidden pb-6 border-b border-gray-400">
				<SectionHeader title="OUR EDITORS" />
				<div className="flex flex-row overflow-x-auto hide-scrollbar space-x-4">
					{CATIRE_EDITORS.map((editor: any, index: number) => (
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
					{CAT_FACTS.map((catFact: any, index: number) => (
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
	);
}
