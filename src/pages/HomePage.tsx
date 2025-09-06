import NewsSection from "@/components/news/NewsSection";
import TopArticles from "@/components/news/TopArticles";
import NewsHero from "@/components/news/NewsHero";
import BackToTopButton from "@/components/common/BackToTopButton";

export default function HomePage() {
	return (
		<>
			<NewsHero />
			<TopArticles />
			<NewsSection key={"home-article-section"} />
			<BackToTopButton />
		</>
	);
}
