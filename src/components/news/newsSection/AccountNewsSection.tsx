import NewsCard from "../NewsCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ArticleInfo } from "@/types/articleTypes";
import { SectionHeader } from "@/components/common/SectionHeader";

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

	return (
		<>
			<div className="flex flex-row justify-between">
				<SectionHeader title="ARTICLE HISTORY" />
				<div
					className="underline cursor-pointer"
					onClick={() => setUserArticles([])}
				>
					Clear
				</div>
			</div>
			{userArticles.length === 0 ? (
				<p>Your reading history is empty.</p>
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
