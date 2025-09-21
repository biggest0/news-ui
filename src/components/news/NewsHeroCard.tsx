import { Link } from "react-router-dom";

import type { ArticleInfo } from "@/types/articleTypes";
import { incrementArticleViewed } from "@/api/articleApi";

interface NewsCardProp {
	articleInfo: ArticleInfo;
	small: boolean;
}

export default function NewsHeroCard({ articleInfo, small }: NewsCardProp) {
	return (
		<div className={`${small ? "h-24" : "h-48"}`}>
			<h3 className="text-lg font-semibold text-gray-800 hover:text-amber-600 cursor-pointer">
				<Link
					to={`/article/${articleInfo.id}`}
					onClick={() => incrementArticleViewed(articleInfo.id)}
				>
					{articleInfo.title}
				</Link>
			</h3>
			{!small && articleInfo.summary && (
				<span className="text-sm">{articleInfo.summary}</span>
			)}
			{small && <span className="text-sm">{articleInfo.datePublished}</span>}
		</div>
	);
}
