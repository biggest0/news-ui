import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LuSearch } from "react-icons/lu";

import type { AppDispatch, RootState } from "@/store/store";
import type { ArticleInfo } from "@/types/articleTypes";
import NewsCard from "@/components/news/NewsCard";
import { loadArticlesInfoBySearch } from "@/store/articlesSlice";
import { isWithinNDays } from "@/service/dateUtils";
import { sortByWordCount } from "@/service/articleService";

export default function SearchPage() {
	const location = useLocation();
	const { articles, loading, error } = useSelector(
		(state: RootState) => state.article
	);
	const prevArticlesLength = useRef(0);

	const params = new URLSearchParams(location.search);
	const query = params.get("q") || "";
	const dateRange = params.get("dateRange") || "";
	const sortBy = params.get("sortBy") || "";

	const [filteredArticles, setFilteredArticles] = useState<ArticleInfo[]>([]);
	const [page, setPage] = useState(1);
	const [showMore, setShowMore] = useState(true);
	const [fetching, setFetching] = useState(false);

	// page init if search query exists in url send request to load articles
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		if (query) {
			dispatch(loadArticlesInfoBySearch({ page: 1, search: query }));
		}
	}, [query]);

	// article filtering
	useEffect(() => {
		if (query) {
			const lowerCaseQuery = query.toLowerCase();
			let searchedArticles = articles.filter(
				(article) =>
					article.title.toLowerCase().includes(lowerCaseQuery) ||
					article.summary?.toLowerCase().includes(lowerCaseQuery)
			);
			if (dateRange) {
				switch (dateRange) {
					case "24h":
						searchedArticles = searchedArticles.filter((article) => {
							if (article.datePublished) {
								return isWithinNDays(article.datePublished, 1);
							}
						});
						break;
					case "7d":
						searchedArticles = searchedArticles.filter((article) => {
							if (article.datePublished) {
								return isWithinNDays(article.datePublished, 7);
							}
						});
						break;
					case "30d":
						searchedArticles = searchedArticles.filter((article) => {
							if (article.datePublished) {
								return isWithinNDays(article.datePublished, 30);
							}
						});
				}
			}
			if (sortBy) {
				switch (sortBy) {
					case "relevant":
						searchedArticles = sortByWordCount(searchedArticles, query);
						break;

					case "newest":
						searchedArticles = searchedArticles.sort((a, b) => {
							if (b.datePublished && a.datePublished) {
								return (
									new Date(b.datePublished).getTime() -
									new Date(a.datePublished).getTime()
								);
							}
							return 0;
						});
						break;
				}
			}
			setFilteredArticles(searchedArticles);
		}
	}, [query, dateRange, sortBy, articles]);

	// checks if more articles can be loaded
	useEffect(() => {
		if (articles.length === prevArticlesLength.current) {
			setShowMore(false);
		} else {
			setShowMore(true);
			setFetching(false);
			prevArticlesLength.current = articles.length;
		}
	}, [articles]);

	// lazy loading more articles
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
					loadArticlesInfoBySearch({
						page: page + 1,
						search: query,
					})
				);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, showMore]);

	return (
		<div>
			<SearchSection query={query} dateRange={dateRange} sortBy={sortBy} />
			{query && (
				<div>
					<form action=""></form>
				</div>
			)}

			{/* Section for searched articles */}
			<section>
				{filteredArticles.map((article) => (
					<NewsCard key={`search-${article.id}`} articleInfo={article} />
				))}
			</section>
		</div>
	);
}

function SearchSection({
	query,
	dateRange,
	sortBy,
}: {
	query: string;
	dateRange: string;
	sortBy: string;
}) {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const [input, setInput] = useState(query ?? "");

	useEffect(() => {
		setInput(query);
	}, [query]);

	const updateUrl = (q: string, dateRange: string, sort: string) => {
		const params = new URLSearchParams();
		if (q) params.set("q", q);
		if (dateRange) params.set("dateRange", dateRange);
		if (sort) params.set("sortBy", sort);
		navigate(`/search?${params.toString()}`);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: hook into your search logic (navigate, dispatch, etc.)
		if (input.trim()) {
			dispatch(loadArticlesInfoBySearch({ page: 1, search: input }));
			const params = new URLSearchParams();
			params.set("q", input);
			if (dateRange) params.set("dateRange", dateRange);
			if (sortBy) params.set("sortBy", sortBy);
			navigate(`/search?${params.toString()}`);
		}
	};

	return (
		<section className="w-full flex flex-col justify-center items-center py-4 h-48 bg-gray-50">
			{/* Search bar */}
			<form
				onSubmit={handleSubmit}
				className="flex items-center w-full max-w-md border-b overflow-hidden mb-4"
			>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Search articles..."
					className="flex-grow py-2 outline-none text-gray-700 text-2xl"
				/>
				<button
					type="submit"
					className="text-gray-400 px-4 py-2 hover:text-black transition cursor-pointer"
				>
					<LuSearch />
				</button>
			</form>

			{/* Filter bar */}
			<div className="flex justify-start gap-8 w-full max-w-md text-sm text-gray-600">
				{/* Date Range */}
				<select
					value={dateRange}
					className="py-1 font-medium text-gray-700"
					onChange={(e) => updateUrl(query, e.target.value, sortBy)}
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
					onChange={(e) => updateUrl(query, dateRange, e.target.value)}
				>
					<option value="" disabled hidden>
						Sort By
					</option>
					<option value="relevant">Relevant</option>
					<option value="newest">Newest</option>
				</select>
			</div>
		</section>
	);
}
