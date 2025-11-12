import TopArticlesSection from "@/components/news/TopArticlesSection";
import NewsHero from "@/components/news/NewsHero";
import BackToTopButton from "@/components/common/BackToTopButton";
import { HomeNewsSection } from "@/components/news/newsSection/HomeNewsSection";
import { HomeContentSections } from "@/components/news/newsSection/HomeMobileSections";

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
