import { Link } from "react-router-dom";

import type { ArticleInfo } from "@/types/articleTypes";
import { incrementArticleViewed } from "@/api/articleApi";
import { recordArticleRead } from "@/service/userArticleService";
import { useAuth } from "@/contexts/AuthContext";

interface NewsCardProp {
	articleInfo: ArticleInfo;
	small: boolean;
}

export default function NewsHeroCard({ articleInfo, small }: NewsCardProp) {
	const { isAuthenticated } = useAuth();

	const handleClick = () => {
		incrementArticleViewed(articleInfo.id);
		if (isAuthenticated) {
			recordArticleRead(articleInfo.id);
		}
	};

	return (
		<div className={`${small ? "min-h-24" : "min-h-48"}`}>
			<h3
				className={`${
					small ? "text-lg" : "text-xl"
				} font-semibold text-foreground hover:text-brand transition-colors duration-200 cursor-pointer`}
			>
				<Link
					to={`/article/${articleInfo.id}`}
					onClick={handleClick}
				>
					{articleInfo.title}
				</Link>
			</h3>
			{!small && articleInfo.summary && (
				<div className="text-sm lg:text-base text-foreground-secondary">{articleInfo.summary}</div>
			)}
			{small && <div className="text-sm text-muted-foreground">{articleInfo.datePublished}</div>}
		</div>
	);
}
