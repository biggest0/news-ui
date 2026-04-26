import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import NewsCard from "../cards/NewsCard";
import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";
import type { AppDispatch, RootState } from "@/store/store";
import {
	loadArticleHistory,
	clearArticleHistoryThunk,
} from "@/store/userContentSlice";

export const AccountNewsSection = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { accessToken } = useAuth();
	const { articles } = useSelector(
		(state: RootState) => state.userContent.history
	);
	const isLoading = useSelector(
		(state: RootState) => state.userContent.loading.history
	);

	useEffect(() => {
		if (!accessToken) return;
		dispatch(loadArticleHistory({ accessToken }));
	}, [accessToken, dispatch]);

	const handleClear = async () => {
		if (!accessToken) return;
		try {
			await dispatch(clearArticleHistoryThunk(accessToken)).unwrap();
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
