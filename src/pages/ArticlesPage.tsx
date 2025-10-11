import NewsSection from "@/components/news/NewsSection";
import { useLocation } from "react-router-dom";
import { CategoryNewsSection } from "@/components/news/newsSection/CategoryNewsSection";

export default function ArticlesPage() {
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];
	return (
		<>
			<CategoryNewsSection key={`${selectedCategory}-category-news-section`} />
		</>
	);
}
