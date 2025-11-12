import TopArticlesSection from "@/components/news/section/TopArticlesSection";
import FeaturedSection from "@/components/news/section/FeaturedSection";
import BackToTopButton from "@/components/common/BackToTopButton";
import { HomeNewsSection } from "@/components/news/section/newsSections/HomeNewsSection";
import { HomeContentSections } from "@/components/news/section/HomeMobileSections";

export default function HomePage() {
	return (
		<>
			<FeaturedSection />
			<TopArticlesSection />
			<HomeContentSections />
			<HomeNewsSection key={"home-article-section"} />
			<BackToTopButton />
		</>
	);
}
