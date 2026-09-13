import { useTranslation } from "react-i18next";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { SectionShell } from "@/components/common/layout/SectionShell";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import NewsHeroCard from "@/components/news/cards/NewsHeroCard";
import FeaturedHeroImage, {
	type HeroImageVariant,
} from "@/components/news/section/featured/FeaturedHeroImage";
import { SECTIONS } from "@/constants/keys";
import { useFeaturedArticles } from "@/hooks/useArticleHooks";
import { useSectionVisible } from "@/hooks/useSectionCollapse";

interface FeaturedSectionProps {
	/**
	 * Press-photo treatment. The home page takes the default; the prop exists
	 * so the look can be switched without rewriting the section.
	 */
	heroVariant?: HeroImageVariant;
}

/**
 * Desktop hero + featured grid — shares the featured cache with StaffPicks.
 *
 * Built on the same SectionShell / SectionHeaderExpandable / CollapsibleSection
 * trio as every other home section, so it collapses, hides and restores from
 * its own options menu like the rest. The header sits above the grid rather
 * than inside the left column: there it would push only that column down and
 * break the top alignment between the lead headlines and the press photo.
 */
export default function FeaturedSection({
	heroVariant = "ruled",
}: FeaturedSectionProps = {}) {
	const { t } = useTranslation();
	const isVisible = useSectionVisible(SECTIONS.FEATURED);
	const featuredArticles = useFeaturedArticles();

	return (
		// Desktop only: the phone gets MobileStaffPicksSection instead.
		//
		// The breakpoint class is opted into only while the section is visible.
		// SectionShell hides a removed section with a plain `hidden`, and an
		// unconditional `md:block` out-specifies that at md and up: "Remove"
		// looked like it did nothing on the very widths this section renders at.
		// Desktop only: the phone gets MobileStaffPicksSection instead.
		//
		// The breakpoint class is opted into only while the section is visible.
		// SectionShell hides a removed section with a plain `hidden`, and an
		// unconditional `md:block` out-specifies that at md and up: "Remove"
		// looked like it did nothing on the very widths this section renders at.
		<SectionShell
			visible={isVisible}
			bordered
			className={isVisible ? "hidden md:block" : undefined}
		>
			{/*
			 * The label sits in the left column rather than in a full-width row
			 * above the grid, so the photo and the right-hand headlines start
			 * level with it instead of being pushed down by an empty band.
			 *
			 * That costs one thing: the collapsing region can no longer be a
			 * single wrapper, because the label has to stay *outside* it. Put the
			 * label inside and collapsing takes its chevron with it, leaving no
			 * way to expand again. So the left column's cards and the photo/right
			 * pair are two CollapsibleSections sharing one section key: they are
			 * not DOM siblings, but they fold together.
			 */}
			<div className="grid grid-cols-4 gap-x-4">
				{/* Left column - label, then 2 lead articles (title + summary) */}
				<div className="col-span-1 flex min-h-0 flex-col">
					<SectionHeaderExpandable
						title={t("SECTION.FEATURED")}
						section={SECTIONS.FEATURED}
					/>
					<CollapsibleSection section={SECTIONS.FEATURED}>
						<div className="flex flex-col gap-3 min-h-0 overflow-y-auto hide-scrollbar">
							{featuredArticles.slice(0, 2).map((article) => (
								<div key={`top-${article.id}`} className="shrink-0">
									<NewsHeroCard articleInfo={article} small={false} />
								</div>
							))}
						</div>
					</CollapsibleSection>
				</div>

				<CollapsibleSection section={SECTIONS.FEATURED} className="col-span-3">
					{/*
					 * min-height, not a fixed height: as the viewport narrows, headlines
					 * wrap to more lines and the band has to grow with them. Capping it
					 * made the cards shrink into each other instead (see shrink-0 below).
					 *
					 * The column gaps are tight on purpose. NewsHeroCard's own floors
					 * (min-h-48 / min-h-24) already account for 384px of the 400px each
					 * column has at the minimum band height, so the gap is almost the
					 * entire remaining budget: the right column only fits its four cards
					 * at gap-1. Each card still reserves more height than its content
					 * needs, so the visible separation is wider than the gap suggests.
					 */}
					<div className="grid grid-cols-3 grid-rows-2 gap-4 min-h-112">
						<FeaturedHeroImage variant={heroVariant} />

						{/* Right column - 4 secondary articles (title + date) */}
						<div className="col-span-1 row-span-2 flex flex-col gap-1 min-h-0 overflow-y-auto hide-scrollbar">
							{featuredArticles.slice(2, 6).map((article) => (
								<div key={`top-${article.id}`} className="shrink-0">
									<NewsHeroCard articleInfo={article} small={true} />
								</div>
							))}
						</div>
					</div>
				</CollapsibleSection>
			</div>
		</SectionShell>
	);
}
