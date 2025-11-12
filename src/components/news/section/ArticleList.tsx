import type { ArticleInfo } from "@/types/articleTypes";
import NewsCard from "../NewsCard";

interface ArticleListProps {
	articles: ArticleInfo[];
	onArticleRead: (article: ArticleInfo) => void;
}

export function ArticleList({ articles, onArticleRead }: ArticleListProps) {
	if (articles.length === 0) {
		return null;
	}

	return (
		<div>
			{articles.map((article) => (
				<NewsCard
					key={article.id}
					articleInfo={article}
					onRead={onArticleRead}
				/>
			))}
		</div>
	);
}
