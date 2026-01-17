import FeaturedSection from "@/components/news/section/FeaturedSection";
import BackToTopButton from "@/components/common/navigation/BackToTopButton";
import { HomeNewsSection } from "@/components/news/section/newsSections/HomeNewsSection";
import { HomeContentSections } from "@/components/news/section/HomeMobileSections";
import PopularSection from "@/components/news/section/PopularSection";

export default function HomePage() {
	return (
		<>
			<FeaturedSection />
			<PopularSection />
			<HomeContentSections />
			<HomeNewsSection key={"home-article-section"} />
			<BackToTopButton />
		</>
	);
}
