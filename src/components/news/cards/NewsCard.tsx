import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { ArticleInfo, ArticleDetail } from "@/types/articleTypes";
import type { RootState, AppDispatch } from "@/store/store";
import { loadArticleDetail } from "@/store/articlesSlice";
import { incrementArticleViewed } from "@/api/articleApi";
import { recordArticleRead } from "@/service/userArticleService";
import { useAuth } from "@/contexts/AuthContext";
import { ShareButton } from "../../common/social/ShareButton";
import { LikeButton } from "../../common/social/LikeButton";
import { capitalizeWord } from "@/utils/text/wordUtils";

interface NewsCardProp {
	articleInfo: ArticleInfo;
}

export default function NewsCard({ articleInfo }: NewsCardProp) {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { isAuthenticated } = useAuth();
	const articleDetail: ArticleDetail = useSelector(
		(state: RootState) => state.article.articlesDetail[articleInfo.id]
	);

	const [expanded, setExpanded] = useState(false);
	const [articleDetailfetched, setArticleDetailfetched] = useState(false);
	const [isLoadingDetail, setIsLoadingDetail] = useState(false);

	async function handleExpand() {
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
			if (isAuthenticated) {
				recordArticleRead(articleInfo.id);
			}
		}
	}

	function categoryColor(category: string): string {
		switch (category) {
			case "world":
				return "text-[rgba(209,45,22,0.7)] dark:text-red-400";

			case "business":
				return "text-[rgba(37,99,235,0.8)] dark:text-blue-400";

			case "lifestyle":
				return "text-[rgba(168,55,207,0.7)] dark:text-purple-400";

			case "science":
				return "text-[rgba(20,124,166,0.8)] dark:text-teal-400";

			case "technology":
				return "text-[rgba(6,152,212,0.7)] dark:text-cyan-400";

			case "sport":
				return "text-[rgba(21,128,61,0.7)] dark:text-green-400";

			case "politics":
				return "text-[rgba(37,51,80,0.8)] dark:text-slate-300";

			case "other":
				return "text-[rgba(107,114,128,0.7)] dark:text-slate-400";

			default:
				return "text-secondary";
		}
	}

	return (
		<div className="flex flex-col justify-between min-h-48 max-h-full border-b border-border py-4 w-full space-y-8 transition-colors duration-200">
			<div>
				<h3 className="text-xl font-semibold text-primary">
					{articleInfo.title}
				</h3>
				<div className="text-sm text-muted">{articleInfo.datePublished}</div>
				<div
					className={`text-sm ${categoryColor(articleInfo.mainCategory ?? "")}`}
				>
					{capitalizeWord(articleInfo.mainCategory)}
				</div>
			</div>

			{/* Article Summary/ Paragraphs */}
			<div className="text-secondary">
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
							<div className="py-4 text-muted">{t("ARTICLE_CARD.LOADING_DETAILS")}</div>
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
									{articleDetail.subCategory?.map((subCat, index) => (
										<Link
											key={`${articleDetail.id}-category-${index}}`}
											to={`/subcategory/${encodeURIComponent(subCat)}`}
											className="hover:text-accent transition-colors"
										>
											{subCat}
										</Link>
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
					className="cursor-pointer hover:text-accent self-start transition-colors"
					onClick={handleExpand}
				>
					{!expanded ? t("ARTICLE_CARD.READ_MORE") : t("ARTICLE_CARD.HIDE")}
				</div>
				<div className="flex items-center gap-2">
					<div className="min-w-12">
						<LikeButton articleId={articleInfo.id} initialLikeCount={articleInfo.likeCount} />
					</div>
					<ShareButton articleId={articleInfo.id} />
				</div>
			</div>
		</div>
	);
}
