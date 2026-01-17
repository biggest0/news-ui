import { EditorCardHorizontal } from "@/components/layout/sideColumn/EditorCardHorizontal";
import { CATIRE_EDITORS, CAT_FACTS } from "@/components/layout/sideColumn/constants";
import { CatFactsCard } from "@/components/layout/sideColumn/CatFactsCard";
import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { SELECTED_ARTICLES } from "../tempArticles";
import { Link } from "react-router-dom";
import { incrementArticleViewed } from "@/api/articleApi";
import { handleLocalStorageUpdate } from "@/service/localStorageService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ArticleInfo } from "@/types/articleTypes";
import { USER_ARTICLE_HISTORY } from "@/constants/keys";
import EditorsSection from "../section/EditorsSection";
import CatFactsSection from "../section/CatFactsSection";

export default function NewsSideColumn() {
	const [articleHistory, setArticleHistory] = useLocalStorage<ArticleInfo[]>(
		USER_ARTICLE_HISTORY,
		[]
	);
	const selectedArticles = SELECTED_ARTICLES;

	return (
		<>
			{/* our editors */}
			<EditorsSection />

			{/* staff favorites, for future */}
			<div className="border-b border-gray-400 pb-6 space-y-4">
				<SectionHeader title="STAFF FAVORITES" />

				{selectedArticles.slice(0, 5).map((article) => (
					<div key={`side-${article.id}`}>
						<Link
							to={`/article/${article.id}`}
							className="py-2 hover:text-amber-600 transition-colors duration-200 cursor-pointer"
							onClick={() => {
								incrementArticleViewed(article.id);
								handleLocalStorageUpdate(
									article,
									articleHistory,
									setArticleHistory
								);
							}}
						>
							{article.title}
						</Link>
					</div>
				))}
			</div>

			{/* cat facts */}
			<CatFactsSection />

			{/* cat merch */}
			{/* <div className="">
				<SectionHeader title="CAT MERCH" />
				<div className="border-b border-gray-400 py-4">
					<div>Coming one day ...</div>
				</div>
			</div> */}
		</>
	);
}
