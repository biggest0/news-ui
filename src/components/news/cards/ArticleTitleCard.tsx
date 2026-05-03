import { Link } from "react-router-dom";

import { incrementArticleViewed } from "@/api/articleApi";
import { recordArticleRead } from "@/service/userArticleService";
import { useAuth } from "@/contexts/AuthContext";

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
	const { isAuthenticated } = useAuth();


	const handleClick = () => {
		// Fire-and-forget: increment the public view counter for all users,
		// and record this article in the authenticated user's reading history if logged in.
		incrementArticleViewed(articleId);
		if (isAuthenticated) {
			recordArticleRead(articleId);
		}
	};

	return (
		<Link
			to={`/article/${articleId}`}
			className="font-medium text-primary hover:text-accent transition-colors duration-200 cursor-pointer"
			onClick={handleClick}
		>
			{index + 1 + ". " + articleTitle}
		</Link>
	);
};
