import NewsSection from "@/components/news/NewsSection";
import TopArticles from "@/components/news/TopArticles";
import NewsHero from "@/components/news/NewsHero";

export default function HomePage() {
	return (
		<>
			<NewsHero />
			<TopArticles />
			<NewsSection />
		</>
	);
}
