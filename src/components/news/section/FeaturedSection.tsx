// import { useSelector } from "react-redux";

import Image from "@/assets/news_hero_image.jpg";
// import type { RootState } from "@/store/store";
import NewsHeroCard from "../cards/NewsHeroCard";
import type { ArticleInfo } from "@/types/articleTypes";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { USER_ARTICLE_HISTORY } from "@/constants/keys";
import { handleLocalStorageUpdate } from "@/service/localStorageService";
import { SELECTED_ARTICLES } from "../tempArticles";

export default function FeaturedSection() {
	// const { topTenArticles } = useSelector((state: RootState) => state.article);
	const [articleHistory, setArticleHistory] = useLocalStorage<ArticleInfo[]>(
		USER_ARTICLE_HISTORY,
		[]
	);

	const selectedArticles = SELECTED_ARTICLES;

	const onArticleClick = (article: ArticleInfo) => {
		handleLocalStorageUpdate(article, articleHistory, setArticleHistory);
	};

	return (
		<section className="border-b border-gray-400 py-6 hidden md:grid grid-cols-4 grid-rows-2 gap-4 min-h-112">
			{/* Desktop Layout */}
			{/* Left column - 2 articles */}
			<div className="col-span-1 row-span-2 flex flex-col gap-8">
				{selectedArticles &&
					selectedArticles
						.slice(0, 2)
						.map((article) => (
							<NewsHeroCard
								key={`top-${article.id}`}
								articleInfo={article}
								small={false}
								onOpen={onArticleClick}
							/>
						))}
			</div>

			{/* Image - spans 2x2 */}
			<div className="col-span-2 row-span-2 relative overflow-y-hidden">
				<img
					src={Image}
					alt="Featured News"
					className="w-full h-full object-cover"
				/>
				<div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white text-xl">
					"Reading satire news is like getting your veggies in cake form—tasty,
					fun, and surprisingly informative." — Albert Mewstein
				</div>
			</div>

			{/* Right column - multiple articles with scroll */}
			<div className="col-span-1 row-span-2 flex flex-col gap-4">
				{selectedArticles &&
					selectedArticles
						.slice(2, 6)
						.map((article) => (
							<NewsHeroCard
								key={`top-${article.id}`}
								articleInfo={article}
								small={true}
								onOpen={onArticleClick}
							/>
						))}
			</div>
		</section>
	);
}
