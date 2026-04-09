import type { ArticleInfo } from "@/types/articleTypes";
import NewsCard from "../cards/NewsCard";

interface ArticleListProps {
	articles: ArticleInfo[];
}

export function ArticleList({ articles }: ArticleListProps) {
	if (articles.length === 0) {
		return null;
	}

	return (
		<div>
			{articles.map((article) => (
				<NewsCard
					key={article.id}
					articleInfo={article}
				/>
			))}
		</div>
	);
}
