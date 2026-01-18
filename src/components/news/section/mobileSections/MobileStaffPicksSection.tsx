import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import CollapsibleSection from "../CollapsibleSection";
import { SECTIONS, USER_ARTICLE_HISTORY } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ArticleInfo } from "@/types/articleTypes";
import { SELECTED_ARTICLES } from "../../tempArticles";
import NewsHeroCard from "../../cards/NewsHeroCard";
import { handleLocalStorageUpdate } from "@/service/localStorageService";
import Image from "@/assets/news_hero_image.jpg";

export default function MobileStaffPicksSection() {
	const isVisible = useSectionVisible(SECTIONS.STAFF_PICKS);
	const [articleHistory, setArticleHistory] = useLocalStorage<ArticleInfo[]>(
		USER_ARTICLE_HISTORY,
		[]
	);
	const onArticleClick = (article: ArticleInfo) => {
		handleLocalStorageUpdate(article, articleHistory, setArticleHistory);
	};

	return (
		<div className="flex flex-col md:hidden">
			{/* Home Main Picture */}
			<section className="border-b border-gray-400 py-6">
				<div className="relative w-full h-64 overflow-hidden">
					<img
						src={Image}
						alt="Featured News"
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="text-center">
					"Reading satire news is like getting your veggies in cake form—tasty,
					fun, and surprisingly informative." — Albert Mewstein
				</div>
			</section>

			{/* Staff Picks Section */}
			<section
				className={`py-6 border-b border-gray-400 ${isVisible ? "" : "hidden"}`}
			>
				{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
				<SectionHeaderExpandable
					title="STAFF PICKS"
					section={SECTIONS.STAFF_PICKS}
				/>
				<CollapsibleSection section={SECTIONS.STAFF_PICKS}>
					<div className="w-full overflow-x-auto overflow-y-hidden pt-4 hide-scrollbar">
						<div className="flex gap-x-4">
							{SELECTED_ARTICLES.slice(0, 6).map((article) => (
								<div
									key={`mobile-staff-picks-${article.id}`}
									className="flex-shrink-0 w-64"
								>
									<NewsHeroCard
										articleInfo={article}
										small={true}
										onOpen={onArticleClick}
									/>
								</div>
							))}
						</div>
					</div>
				</CollapsibleSection>
			</section>
		</div>
	);
}
