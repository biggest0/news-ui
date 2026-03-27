import { useEffect, useState } from "react";

import NewsCard from "../cards/NewsCard";
import type { ArticleHistoryItem } from "@/types/articleTypes";
import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { getArticleHistory, clearArticleHistory } from "@/service/userArticleService";

export const AccountNewsSection = () => {
	const { t } = useTranslation();
	const { accessToken } = useAuth();
	const [articles, setArticles] = useState<ArticleHistoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!accessToken) {
			setIsLoading(false);
			return;
		}

		const loadHistory = async () => {
			const result = await getArticleHistory(accessToken);
			setArticles(result.articles);
			setIsLoading(false);
		};

		loadHistory();
	}, [accessToken]);

	const handleClear = async () => {
		if (!accessToken) return;
		try {
			await clearArticleHistory(accessToken);
			setArticles([]);
		} catch (error) {
			console.error("Failed to clear history:", error);
		}
	};

	if (isLoading) {
		return <p>{t("COMMON.LOADING")}</p>;
	}

	return (
		<>
			<div className="flex flex-row justify-between">
				<SectionHeader title={t("ACCOUNT.ARTICLE_HISTORY")} />
				{articles.length > 0 && (
					<div
						className="underline cursor-pointer"
						onClick={handleClear}
					>
						{t("ACCOUNT.CLEAR")}
					</div>
				)}
			</div>
			{articles.length === 0 ? (
				<p>{t("ACCOUNT.EMPTY_HISTORY")}</p>
			) : (
				<div>
					{articles.map((article) => (
						<NewsCard
							key={`history-${article.id}`}
							articleInfo={article}
						/>
					))}
				</div>
			)}
		</>
	);
};
