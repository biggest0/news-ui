import type { ArticleInfo } from "../types/articleTypes";

interface NewsCardProp {
	articleInfo: ArticleInfo;
	small: boolean;
}

export default function NewsHeroCard({ articleInfo, small }: NewsCardProp) {
	return (
		<div className={`${small ? "h-24" : "h-48"}`}>
			<h3 className="text-lg font-semibold text-gray-800 hover:text-amber-600 cursor-pointer">
				{articleInfo.title}
			</h3>
			{!small && articleInfo.summary && <span>{articleInfo.summary}</span>}
			{small && <span>{articleInfo.datePublished}</span>}
		</div>
	);
}
