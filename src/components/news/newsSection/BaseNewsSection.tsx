// BaseNewsSection.tsx - Parent Component
import { useEffect, useRef, useState } from "react";
import NewsCard from "../NewsCard";
import NewsSideColumn from "../NewsSideColumn";
import { EditorCardVertical } from "@/components/sideColumn/EditorCardVertical";
import { CATIRE_EDITORS, CAT_FACTS } from "@/components/sideColumn/constants";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CatFactsCard } from "@/components/sideColumn/CatFactsCard";
import type { ArticleInfo } from "@/types/articleTypes";
import { isWithinNDays } from "@/service/dateUtils";

interface BaseNewsSectionProps {
	articles: ArticleInfo[];
	loadMoreArticles: (page: number) => void;
	showHomeContent?: boolean;
	resetKey?: string;
}

export function BaseNewsSection({
	articles,
	loadMoreArticles,
	showHomeContent = false,
	resetKey,
}: BaseNewsSectionProps) {
	const prevArticlesLength = useRef(0);
	const [articlesToDisplay, setArticlesToDisplay] = useState(articles);
	const [page, setPage] = useState(1);
	const [showMore, setShowMore] = useState(true);
	const [fetching, setFetching] = useState(false);
	const [dateRange, setDateRange] = useState("all");
	const [sortBy, setSortBy] = useState("newest");

	// Reset state when component mounts or resetKey changes
	useEffect(() => {
		prevArticlesLength.current = 0;
		setShowMore(true);
		setFetching(false);
	}, [resetKey]);

	// Check if more articles to load
	useEffect(() => {
		if (articles.length === prevArticlesLength.current) {
			// console.log("same length", articles.length, prevArticlesLength.current);
			setShowMore(false);
		} else {
			// console.log("ran");
			setShowMore(true);
			setFetching(false);
			prevArticlesLength.current = articles.length;
		}
	}, [articles]);

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
				loadMoreArticles(page + 1);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, showMore, page, loadMoreArticles]);

	// Filter articles when dateRange or sortBy changes
	useEffect(() => {
		let tempArticles = [...articles];
		if (dateRange) {
			console.log("rannn");
			switch (dateRange) {
				case "24h":
					console.log("24h ran");
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
			setArticlesToDisplay(tempArticles);
		}
	}, [dateRange, articles]);

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
							className="py-1 font-medium text-gray-700"
							onChange={(e) => setSortBy(e.target.value)}
						>
							<option value="" disabled>
								Sort By
							</option>
							<option value="newest">Newest</option>
						</select>
					</div>
				</div>

				{articlesToDisplay.length > 0 && (
					<div>
						{articlesToDisplay.map((article) => (
							<NewsCard key={article.id} articleInfo={article} />
						))}
					</div>
				)}

				<div className="text-center text-gray-500 py-4">
					No more articles to load.
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
