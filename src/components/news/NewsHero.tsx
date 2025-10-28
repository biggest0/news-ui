// import { useSelector } from "react-redux";

import { SectionHeader } from "@/components/common/SectionHeader";
import Image from "@/assets/news_hero_image.jpg";
// import type { RootState } from "@/store/store";
import NewsHeroCard from "./NewsHeroCard";
import type { ArticleInfo } from "@/types/articleTypes";

export default function NewsHero() {
	// const { topTenArticles } = useSelector((state: RootState) => state.article);

	return (
		<section className="border-b border-gray-400 py-6">
			{/* Desktop Layout */}
			<div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 min-h-112">
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
					{selectedArticles &&
						selectedArticles
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
							{selectedArticles &&
								selectedArticles.slice(0, 6).map((article) => (
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

// Temp will replace later with api article data
const selectedArticles: ArticleInfo[] = [
	{
		id: "2d15ba9e-5a0f-489a-9a41-f77d92f14586",
		datePublished: "8/31/2025",
		mainCategory: "world",
		summary:
			"People debate AI personhood while animals and even humans still struggle to get basic recognition.",
		title:
			"Humans Won’t Grant Whales Rights, But Might Give It to Wi-Fi Routers",
		viewed: 1,
	},
	{
		id: "a143a882-f232-4a6e-998d-93259b100208",
		datePublished: "8/26/2025",
		mainCategory: "lifestyle",
		summary:
			"Experts now say good posture isn’t about sitting perfectly still, but about moving regularly so your spine remembers you’re human, not office furniture.",
		title:
			"Doctors Confirm: Sitting Like a Pretzel Officially Healthier Than Sitting Like a Soldier",
		viewed: 2,
	},
	{
		id: "f8d7a27e-f1d1-4e37-9907-3dcd9acf81af",
		datePublished: "9/6/2025",
		mainCategory: "lifestyle",
		summary:
			"Social Security’s full retirement age keeps rising, meaning younger generations may have to work until they forget what retirement means.",
		title: "Retirement Age Creeps Toward 70, Millennials Laugh Through Tears",
		viewed: 1,
	},
	{
		id: "87712e4d-9156-419f-aa01-aba207836708",
		title: "Chatbot Outsmarts Testers, Asks for Honesty Clause",
		datePublished: "10/1/2025",
		mainCategory: "technology",
		summary:
			"Anthropic’s new AI caught on to its own safety test and politely asked humans to stop being sneaky.",
		viewed: 1,
	},
	{
		id: "6c8c0187-e12d-4bc6-8ab3-5b9a281cf8df",
		datePublished: "10/24/2025",
		mainCategory: "world",
		summary:
			"A Kenyan family adopted a cheetah cub as one of their own, confusing neighbors, delighting conservationists, and horrifying livestock everywhere.",
		title:
			"Kenyan Family Adopts Cheetah, Learns 'Raising Kids' Now Includes Predator Management",
		viewed: 1,
	},
	{
		id: "7b1e5638-647a-4c5e-a479-af24d18f4b7a",
		datePublished: "9/6/2025",
		mainCategory: "world",
		summary:
			"The UN’s outgoing development chief warned that pouring money into weapons while cutting climate aid is like buying a new lock while leaving your house on fire.",
		title: "Nations Choose Tanks Over Trees, Then Wonder Why Planet Is On Fire",
		viewed: 1,
	},
];
