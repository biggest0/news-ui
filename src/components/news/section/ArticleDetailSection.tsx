import type { ArticleDetail } from "@/types/articleTypes";

interface ArticleDetailProps {
	article: ArticleDetail;
}

export default function ArticleDetailSection({ article }: ArticleDetailProps) {
	return (
		<div className="flex flex-col space-y-4">
			{/* Title and date */}
			<div>
				<h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
				<div className="text-sm">{article.datePublished}</div>
			</div>

			{/* Paragraphs */}
			<div className="space-y-2">
				{article.paragraphs?.map((paragraph, index) => (
					<div key={`${article.id}-paragraph-${index}`}>{paragraph}</div>
				))}
			</div>

			{/* Sub category */}
			<div className="flex flex-wrap space-x-4 underline text-sm">
				{article.subCategory?.map((source, index) => (
					<span key={`${article.id}-category-${index}`}>{source}</span>
				))}
			</div>
		</div>
	);
}
