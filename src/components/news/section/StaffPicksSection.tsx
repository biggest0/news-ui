import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import CollapsibleSection from "./CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { incrementArticleViewed } from "@/api/articleApi";
import { recordArticleRead } from "@/service/userArticleService";
import { useAuth } from "@/contexts/AuthContext";
import type { AppDispatch, RootState } from "@/store/store";
import { loadFeaturedArticles } from "@/store/articlesSlice";

export default function StaffPicksSection() {
	const isVisible = useSectionVisible(SECTIONS.STAFF_PICKS);
	const { isAuthenticated } = useAuth();
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const featuredArticles = useSelector(
		(state: RootState) => state.article.featuredArticles
	);

	// server-curated selection; thunk dedupes if another section already loaded it
	useEffect(() => {
		dispatch(loadFeaturedArticles());
	}, [dispatch]);

	const handleClick = (articleId: string) => {
		incrementArticleViewed(articleId);
		if (isAuthenticated) {
			recordArticleRead(articleId);
		}
	};

	return (
		<section className={`${isVisible ? "" : "hidden"}`}>
			<SectionHeaderExpandable
				title={t("SECTION.STAFF_PICKS")}
				section={SECTIONS.STAFF_PICKS}
			/>
			<CollapsibleSection section={SECTIONS.STAFF_PICKS}>
				<div className="border-b border-gray-400 py-4 space-y-4">
					{featuredArticles.slice(0, 5).map((article) => (
						<div key={`side-${article.id}`}>
							<Link
								to={`/article/${article.id}`}
								className="py-2 hover:text-amber-600 transition-colors duration-200 cursor-pointer"
								onClick={() => handleClick(article.id)}
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
