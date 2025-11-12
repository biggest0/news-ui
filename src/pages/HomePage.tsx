import TopArticlesSection from "@/components/news/section/TopArticlesSection";
import NewsHero from "@/components/news/NewsHero";
import BackToTopButton from "@/components/common/BackToTopButton";
import { HomeNewsSection } from "@/components/news/section/newsSections/HomeNewsSection";
import { HomeContentSections } from "@/components/news/section/HomeMobileSections";

export default function HomePage() {
	return (
		<>
			<NewsHero />
			<TopArticlesSection />
			<HomeContentSections />
			<HomeNewsSection key={"home-article-section"} />
			<BackToTopButton />
		</>
	);
}
