import { useTranslation } from "react-i18next";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { SectionShell } from "@/components/common/layout/SectionShell";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { useFeaturedArticles } from "@/hooks/useArticleHooks";
import NewsHeroCard from "@/components/news/cards/NewsHeroCard";
import FeaturedHeroImage from "@/components/news/section/featured/FeaturedHeroImage";

/**
 * Mobile-only hero image + "Staff Picks" carousel. Intentionally separate
 * from the desktop StaffPicksSection (different presentation: hero banner +
 * horizontal card scroll vs. text links); the data loading is shared via
 * useFeaturedArticles.
 */
export default function MobileStaffPicksSection() {
	const isVisible = useSectionVisible(SECTIONS.STAFF_PICKS);
	const { t } = useTranslation();
	const featuredArticles = useFeaturedArticles();

	return (
		<div className="flex flex-col md:hidden">
			{/* Home Main Picture — same press-photo treatment as the desktop hero
			    (FeaturedHeroImage), so the cutline is set once and both stay in
			    step. Only the sizing differs: no grid cell to fill here, so the
			    photo takes a fixed height. */}
			<section className="border-b border-border py-6">
				<FeaturedHeroImage
					variant="ruled"
					className=""
					photoClassName="w-full h-64"
				/>
			</section>

			{/* Staff Picks Section */}
			<SectionShell visible={isVisible} bordered>
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
									<NewsHeroCard articleInfo={article} small={true} />
								</div>
							))}
						</div>
					</div>
				</CollapsibleSection>
			</SectionShell>
		</div>
	);
}
