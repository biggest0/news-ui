import TopArticlesSection from "@/components/news/TopArticlesSection";
import NewsHero from "@/components/news/NewsHero";
import BackToTopButton from "@/components/common/BackToTopButton";
import { HomeNewsSection } from "@/components/news/newsSection/HomeNewsSection";

export default function HomePage() {
	return (
		<>
			<NewsHero />
			<TopArticlesSection />
			<HomeNewsSection key={"home-article-section"} />
			<BackToTopButton />
		</>
	);
}
