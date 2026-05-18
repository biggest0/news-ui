import type { ArticleDetail } from "@/types/articleTypes";

interface ArticleDetailProps {
	article: ArticleDetail;
}

export default function ArticleDetailSection({ article }: ArticleDetailProps) {
	return (
		<div className="flex flex-col space-y-4">
			{/* Title and date */}
			<header className="pb-6 border-b border-border-subtle">
				<div className="text-sm text-muted mb-2">{article.datePublished}</div>
				<h1 className="text-3xl text-primary">{article.title}</h1>
			</header>

			{/* Paragraphs */}
			<div className="space-y-2">
				{article.paragraphs?.map((paragraph, index) => (
					<div key={`${article.id}-paragraph-${index}`} className="text-secondary">{paragraph}</div>
				))}
			</div>

			{/* Sub category */}
			<div className="flex flex-wrap space-x-4 underline text-sm text-muted">
				{article.subCategory?.map((source, index) => (
					<span key={`${article.id}-category-${index}`}>{source}</span>
				))}
			</div>
		</div>
	);
}
