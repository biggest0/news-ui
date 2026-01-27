import NewsCard from "../cards/NewsCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ArticleInfo } from "@/types/articleTypes";
import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useTranslation } from "react-i18next";

interface AccountNewsSectionProps {
	localStorageKey: string;
}

export const AccountNewsSection = ({
	localStorageKey,
}: AccountNewsSectionProps) => {
	const [userArticles, setUserArticles] = useLocalStorage<ArticleInfo[]>(
		localStorageKey,
		[]
	);
	const { t } = useTranslation();

	return (
		<>
			<div className="flex flex-row justify-between">
				<SectionHeader title={t("ACCOUNT.ARTICLE_HISTORY")} />
				<div
					className="underline cursor-pointer"
					onClick={() => setUserArticles([])}
				>
					{t("ACCOUNT.CLEAR")}
				</div>
			</div>
			{userArticles.length === 0 ? (
				<p>{t("ACCOUNT.EMPTY_HISTORY")}</p>
			) : (
				<div>
					{userArticles.map((article, index) => (
						<NewsCard
							key={`${localStorageKey}-${index}`}
							articleInfo={article}
						/>
					))}
				</div>
			)}
		</>
	);
};
