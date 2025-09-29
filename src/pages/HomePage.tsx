import NewsSection from "@/components/news/NewsSection";
import TopArticlesSection from "@/components/news/TopArticlesSection";
import NewsHero from "@/components/news/NewsHero";
import BackToTopButton from "@/components/common/BackToTopButton";

export default function HomePage() {
	return (
		<>
			<NewsHero />
			<TopArticlesSection />
			<NewsSection key={"home-article-section"} />
			<BackToTopButton />
		</>
	);
}
