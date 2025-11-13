import { Link } from "react-router-dom";

import { incrementArticleViewed } from "@/api/articleApi";

interface ArticleTitleCardProps {
	articleId: string;
	articleTitle: string;
	index: number;
}

export const ArticleTitleCard = ({
	articleId,
	articleTitle,
	index,
}: ArticleTitleCardProps) => {
	return (
		<Link
			to={`/article/${articleId}`}
			className="font-medium text-black hover:text-amber-600 transition-colors duration-200 cursor-pointer"
			onClick={() => incrementArticleViewed(articleId)}
		>
			{index + 1 + ". " + articleTitle}
		</Link>
	);
};
