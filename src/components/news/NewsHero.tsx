import { useSelector } from "react-redux";

import { SectionHeader } from "@/components/common/SectionHeader";
import Image from "@/assets/news_hero_image.jpg";
import type { RootState } from "@/store/store";
import NewsHeroCard from "./NewsHeroCard";

export default function NewsHero() {
	const { topTenArticles } = useSelector(
		(state: RootState) => state.article
	);

	return (
		<section className="border-b border-gray-400 py-6">
			{/* Desktop Layout */}
			<div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 min-h-112">
				{/* Left column - 2 articles */}
				<div className="col-span-1 row-span-2 flex flex-col gap-8">
					{topTenArticles &&
						topTenArticles
							.slice(0, 2)
							.map((article) => (
								<NewsHeroCard
									key={`top-${article.id}`}
									articleInfo={article}
									small={false}
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
						"Reading satire news is like getting your veggies in cake
						form—tasty, fun, and surprisingly informative." — Albert Mewstein
					</div>
				</div>

				{/* Right column - multiple articles with scroll */}
				<div className="col-span-1 row-span-2 flex flex-col gap-4">
					{topTenArticles &&
						topTenArticles
							.slice(2, 6)
							.map((article) => (
								<NewsHeroCard
									key={`top-${article.id}`}
									articleInfo={article}
									small={true}
								/>
							))}
				</div>
			</div>

			{/* Mobile Layout */}
			<div className="flex flex-col gap-y-6 md:hidden">
				{/* Image first on mobile */}
				<div className="border-b border-gray-400 pb-6">
					<div className="relative w-full h-64 overflow-hidden">
						<img
							src={Image}
							alt="Featured News"
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="text-center">
						"Reading satire news is like getting your veggies in cake
						form—tasty, fun, and surprisingly informative." — Albert Mewstein
					</div>
				</div>

				{/* Combined articles column - horizontal scroll */}
				<div>
					<SectionHeader title="STAFF PICKS" />
					<div className="w-full overflow-x-auto overflow-y-hidden pt-4 hide-scrollbar">
						<div className="flex gap-x-4">
							{topTenArticles &&
								topTenArticles.slice(0, 6).map((article) => (
									<div
										key={`mobile-staff-picks-${article.id}`}
										className="flex-shrink-0 w-64"
									>
										<NewsHeroCard articleInfo={article} small={true} />
									</div>
								))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
