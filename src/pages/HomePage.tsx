import FeaturedSection from "@/components/news/section/FeaturedSection";
import BackToTopButton from "@/components/common/navigation/BackToTopButton";
import { HomeNewsSection } from "@/components/news/section/newsSections/HomeNewsSection";
import PopularSection from "@/components/news/section/PopularSection";
import MobileEditorsSection from "@/components/news/section/mobileSections/MobileEditorsSection";
import MobileCatFactsSection from "@/components/news/section/mobileSections/MobileCatFactsSection";

export default function HomePage() {
	return (
		<>
			<FeaturedSection />
			<PopularSection />
			<MobileEditorsSection />
			<MobileCatFactsSection />
			<HomeNewsSection key={"home-article-section"} />
			<BackToTopButton />
		</>
	);
}
