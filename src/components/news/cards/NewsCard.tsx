import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { ArticleInfo, ArticleDetail } from "@/types/articleTypes";
import type { RootState, AppDispatch } from "@/store/store";
import { loadArticleDetail } from "@/store/articlesSlice";
import { incrementArticleViewed } from "@/api/articleApi";
import { ShareButton } from "../../common/social/ShareButton";
import { capitalizeWord } from "@/utils/text/wordUtils";

interface NewsCardProp {
	articleInfo: ArticleInfo;
	onRead?: (article: ArticleInfo) => void;
}

export default function NewsCard({ articleInfo, onRead }: NewsCardProp) {
	const dispatch = useDispatch<AppDispatch>();
	// const {articlesDetail, loading, error} = useSelector((state: RootState) => state.article)
	const articleDetail: ArticleDetail = useSelector(
		(state: RootState) => state.article.articlesDetail[articleInfo.id]
	);

	const [expanded, setExpanded] = useState(false);
	const [articleDetailfetched, setArticleDetailfetched] = useState(false);
	const [isLoadingDetail, setIsLoadingDetail] = useState(false);

	async function handleExpand() {
		if (!expanded && onRead) {
			onRead(articleInfo);
		}
		setExpanded((prev) => !prev);
		if (!articleDetailfetched && !isLoadingDetail) {
			setIsLoadingDetail(true);
			await dispatch(loadArticleDetail(articleInfo.id))
				.then(() => {
					setArticleDetailfetched(true);
				})
				.catch((error) => {
					console.error("Failed to fetch article detail:", error);
					// Reset states on error so user can retry
					setArticleDetailfetched(false);
				})
				.finally(() => {
					setIsLoadingDetail(false);
				});
			incrementArticleViewed(articleInfo.id);
		}
	}

	function categoryColor(category: string): string {
		switch (category) {
			case "world":
				return "text-[rgba(209,45,22,0.7)]"; // orange

			case "business":
				return "text-[rgba(37,99,235,0.8)]"; // blue

			case "lifestyle":
				return "text-[rgba(168,55,207,0.7)]"; // purple

			case "science":
				return "text-[rgba(20,124,166,0.8)]"; // teal

			case "technology":
				return "text-[rgba(6,152,212,0.7)]"; // cyan

			case "sport":
				return "text-[rgba(21,128,61,0.7)]"; // green

			case "politics":
				return "text-[rgba(37,51,80,0.8)]"; // dark gray

			case "other":
				return "text-[rgba(107,114,128,0.7)]"; // light gray

			default:
				return "text-gray-700";
		}
	}

	return (
		<div className="flex flex-col justify-between min-h-48 max-h-full border-b border-gray-400 py-4 w-full space-y-8">
			<div>
				<h3 className="text-xl font-semibold text-gray-800">
					{articleInfo.title}
				</h3>
				<div className="text-sm">{articleInfo.datePublished}</div>
				<div
					className={`text-sm ${categoryColor(articleInfo.mainCategory ?? "")}`}
				>
					{capitalizeWord(articleInfo.mainCategory)}
				</div>
			</div>

			{/* Article Summary/ Paragraphs */}
			<div>
				{/* Grid transition for article's paragraphs on expand */}
				<div
					className={`grid transition-all duration-500 ease-in-out ${
						expanded ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
					}`}
				>
					{/* Transition to display detail when expanded */}
					<div
						className={`overflow-hidden transition-opacity duration-1000 ${
							expanded ? "opacity-100" : "opacity-0"
						}`}
					>
						{/* Display loading if waiting for data*/}
						{isLoadingDetail && !articleDetail && (
							<div className="py-4 text-gray-500">Loading details...</div>
						)}
						{articleDetail && (
							<div className="flex flex-col space-y-4">
								<div className="space-y-2">
									{articleDetail.paragraphs?.map((paragraph, index) => (
										<div key={`${articleDetail.id}-paragraph-${index}}`}>
											{paragraph}
										</div>
									))}
								</div>
								<div className="flex flex-wrap space-x-4 underline text-sm">
									{articleDetail.subCategory?.map((source, index) => (
										<div key={`${articleDetail.id}-category-${index}}`}>
											{source}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
				{/* Grid transition for showing summary when !expanded,*/}
				<div
					className={`grid transition-all duration-500 ease-in-out ${
						!expanded && articleInfo.summary
							? "grid-rows-[1fr]"
							: "grid-rows-[0fr]"
					}`}
				>
					<div
						className={`overflow-hidden transition-opacity duration-1000 ${
							!expanded ? "opacity-100" : "opacity-0"
						}`}
					>
						{articleInfo.summary && <div>{articleInfo.summary}</div>}
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-between items-center">
				<div
					className="cursor-pointer hover:text-amber-600 self-start"
					onClick={handleExpand}
				>
					{!expanded ? "Read More" : "Hide"}
				</div>
				<ShareButton articleId={articleInfo.id} />
			</div>
		</div>
	);
}
