import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import NewsHeroCard from "@/components/news/cards/NewsHeroCard";
import Image from "@/assets/news_hero_image.jpg";
import type { AppDispatch, RootState } from "@/store/store";
import { loadFeaturedArticles } from "@/store/articlesSlice";

export default function MobileStaffPicksSection() {
	const isVisible = useSectionVisible(SECTIONS.STAFF_PICKS);
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const featuredArticles = useSelector(
		(state: RootState) => state.article.featuredArticles
	);

	// server-curated selection; thunk dedupes if another section already loaded it
	useEffect(() => {
		dispatch(loadFeaturedArticles());
	}, [dispatch]);

	return (
		<div className="flex flex-col md:hidden">
			{/* Home Main Picture */}
			<section className="border-b border-gray-400 py-6">
				<div className="relative w-full h-64 overflow-hidden">
					<img
						src={Image}
						alt={t("HERO.IMAGE_ALT")}
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="text-center">{t("HERO.QUOTE")}</div>
			</section>

			{/* Staff Picks Section */}
			<section
				className={`py-6 border-b border-gray-400 ${isVisible ? "" : "hidden"}`}
			>
				{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
				<SectionHeaderExpandable
					title={t("SECTION.STAFF_PICKS")}
					section={SECTIONS.STAFF_PICKS}
				/>
				<CollapsibleSection section={SECTIONS.STAFF_PICKS}>
					<div className="w-full overflow-x-auto overflow-y-hidden pt-4 hide-scrollbar">
						<div className="flex gap-x-4">
							{featuredArticles.slice(0, 6).map((article) => (
								<div
									key={`mobile-staff-picks-${article.id}`}
									className="flex-shrink-0 w-64"
								>
									<NewsHeroCard
										articleInfo={article}
										small={true}
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
