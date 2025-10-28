import { Link } from "react-router-dom";

import type { ArticleInfo } from "@/types/articleTypes";
import { incrementArticleViewed } from "@/api/articleApi";

interface NewsCardProp {
	articleInfo: ArticleInfo;
	small: boolean;
	onOpen?: (article: ArticleInfo) => void;
}

export default function NewsHeroCard({ articleInfo, small, onOpen }: NewsCardProp) {
	return (
		<div className={`${small ? "min-h-24" : "min-h-48"}`}>
			<h3
				className={`${
					small ? "text-lg" : "text-xl"
				} font-semibold text-gray-800 hover:text-amber-600 cursor-pointer`}
			>
				<Link
					to={`/article/${articleInfo.id}`}
					onClick={() => {incrementArticleViewed(articleInfo.id)
						onOpen?.(articleInfo);
					}}
				>
					{articleInfo.title}
				</Link>
			</h3>
			{!small && articleInfo.summary && (
				<div className="text-sm lg:text-base">{articleInfo.summary}</div>
			)}
			{small && <div className="text-sm">{articleInfo.datePublished}</div>}
		</div>
	);
}
