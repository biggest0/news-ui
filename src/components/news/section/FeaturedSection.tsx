import NewsHeroCard from "@/components/news/cards/NewsHeroCard";
import FeaturedHeroImage, {
	type HeroImageVariant,
} from "@/components/news/section/featured/FeaturedHeroImage";
import { useFeaturedArticles } from "@/hooks/useArticleHooks";

interface FeaturedSectionProps {
	/**
	 * Press-photo treatment. The home page takes the default; the prop exists
	 * so the look can be switched without rewriting the section.
	 */
	heroVariant?: HeroImageVariant;
}

/** Desktop hero + featured grid — shares the featured cache with StaffPicks. */
export default function FeaturedSection({
	heroVariant = "ruled",
}: FeaturedSectionProps = {}) {
	const featuredArticles = useFeaturedArticles();

	return (
		// Fixed height, not min-height: left to grow, the band tracks the press
		// photo's natural 1024x685 and runs ~70px taller.
		//
		// The column gaps are tight on purpose. NewsHeroCard's own floors
		// (min-h-48 / min-h-24) already account for 384px of the 400px each
		// column has inside this band, so the gap is almost the entire remaining
		// budget: the right column only fits its four cards at gap-1. Each card
		// still reserves more height than its content needs, so the visible
		// separation is wider than the gap value suggests.
		//
		// At those gaps the columns fit exactly with typical headlines. A long
		// one wraps past its floor and the column scrolls, which is the accepted
		// trade for a band that stays put: capping the text instead was tried and
		// the truncation looked worse than the scroll.
		<section className="border-b border-border py-6 hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-112">
			{/* Desktop Layout */}
			{/* Left column - 2 lead articles (title + summary) */}
			<div className="col-span-1 row-span-2 flex flex-col gap-3 min-h-0 overflow-y-auto hide-scrollbar">
				{featuredArticles.slice(0, 2).map((article) => (
					<NewsHeroCard
						key={`top-${article.id}`}
						articleInfo={article}
						small={false}
					/>
				))}
			</div>

			<FeaturedHeroImage variant={heroVariant} />

			{/* Right column - 4 secondary articles (title + date) */}
			<div className="col-span-1 row-span-2 flex flex-col gap-1 min-h-0 overflow-y-auto hide-scrollbar">
				{featuredArticles.slice(2, 6).map((article) => (
					<NewsHeroCard
						key={`top-${article.id}`}
						articleInfo={article}
						small={true}
					/>
				))}
			</div>
		</section>
	);
}
