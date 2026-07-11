import { useTranslation } from "react-i18next";

import NewsCard from "@/components/news/cards/NewsCard";
import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { SectionErrorMessage } from "@/components/common/feedback/SectionErrorMessage";
import { useAuth } from "@/contexts/AuthContext";
import { useApiLang } from "@/hooks/useApiLang";
import {
	useClearHistoryMutation,
	useGetHistoryQuery,
} from "@/store/api/userContentEndpoints";

/**
 * Reading history on the account page — RTK Query consumer. Clearing history
 * invalidates the History tag, which refetches the (now empty) list.
 */
export const AccountNewsSection = () => {
	const { t } = useTranslation();
	const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
	const lang = useApiLang();

	const {
		data: history,
		isLoading,
		isError,
		refetch,
	} = useGetHistoryQuery({ lang }, { skip: isAuthLoading || !isAuthenticated });
	const [clearHistory] = useClearHistoryMutation();

	const articles = history?.articles ?? [];

	const handleClear = async () => {
		if (!isAuthenticated) return;
		try {
			await clearHistory().unwrap();
		} catch (error) {
			console.error("Failed to clear history:", error);
		}
	};

	if (isLoading) {
		return <p>{t("COMMON.LOADING")}</p>;
	}

	if (isError) {
		return <SectionErrorMessage onRetry={refetch} />;
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
