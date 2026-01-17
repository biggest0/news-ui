import { Link } from "react-router-dom";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import CollapsibleSection from "./CollapsibleSection";
import { SECTIONS, USER_ARTICLE_HISTORY } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { SELECTED_ARTICLES } from "../tempArticles";
import { incrementArticleViewed } from "@/api/articleApi";
import { handleLocalStorageUpdate } from "@/service/localStorageService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ArticleInfo } from "@/types/articleTypes";

export default function StaffPicksSection() {
	const isVisible = useSectionVisible(SECTIONS.STAFF_PICKS);
	const [articleHistory, setArticleHistory] = useLocalStorage<ArticleInfo[]>(
		USER_ARTICLE_HISTORY,
		[]
	);

	return (
		<section className={`${isVisible ? "" : "hidden"}`}>
			{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
			<SectionHeaderExpandable
				title="STAFF PICKS"
				section={SECTIONS.STAFF_PICKS}
			/>
			<CollapsibleSection section={SECTIONS.STAFF_PICKS}>
				<div className="border-b border-gray-400 py-4 space-y-4">
					{SELECTED_ARTICLES.slice(0, 5).map((article) => (
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
			</CollapsibleSection>
		</section>
	);
}
