import NewsSection from "@/components/news/NewsSection";
import { useLocation } from "react-router-dom";

export default function ArticlesPage() {
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];
	return (
		<>
			<NewsSection key={`${selectedCategory}-news-section`} />
		</>
	);
}
