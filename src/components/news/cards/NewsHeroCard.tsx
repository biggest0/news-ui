import { Link } from "react-router-dom";

import type { ArticleInfo } from "@/types/articleTypes";
import { incrementArticleViewed } from "@/api/articleApi";
import { useRecordArticleReadMutation } from "@/store/api/userContentEndpoints";
import { useAuth } from "@/contexts/AuthContext";
import { articlePath } from "@/constants/routes";

interface NewsCardProp {
	articleInfo: ArticleInfo;
	small: boolean;
}

export default function NewsHeroCard({ articleInfo, small }: NewsCardProp) {
	const { isAuthenticated } = useAuth();
	// fire-and-forget: triggered without await (invalidates History)
	const [recordArticleRead] = useRecordArticleReadMutation();

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
					to={articlePath(articleInfo.id)}
					onClick={handleClick}
				>
					{articleInfo.title}
				</Link>
			</h3>
			{!small && articleInfo.summary && (
				<div className="text-sm lg:text-base text-foreground-secondary">{articleInfo.summary}</div>
			)}
			{small && (
				<time dateTime={articleInfo.datePublishedIso} className="block text-sm text-muted-foreground">
					{articleInfo.datePublished}
				</time>
			)}
		</div>
	);
}
