import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import type { RootState, AppDispatch } from "@/store/store";
import { loadTopTenArticles } from "@/store/articlesSlice";
import { ArticleTitleCard } from "@/components/news/cards/ArticleTitleCard";
import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import CollapsibleSection from "./CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";

export default function PopularSection() {
  const dispatch = useDispatch<AppDispatch>();
	const { topTenArticles } = useSelector((state: RootState) => state.article);
	const isVisible = useSectionVisible(SECTIONS.POPULAR);

	useEffect(() => {
		dispatch(loadTopTenArticles());
	}, []);

	return (
		<section
			className={`border-b border-gray-400 py-6 ${
				isVisible ? "" : "hidden"
			}`}
		>
			{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
			<SectionHeaderExpandable title="POPULAR" section={SECTIONS.POPULAR} />
			<CollapsibleSection section={SECTIONS.POPULAR}>
				<div className="grid grid-cols-1 py-4 md:grid-cols-5 md:grid-rows-2 gap-4">
					{topTenArticles.map((article, index) => (
						<ArticleTitleCard
							key={`top-ten-${article.id}`}
							articleId={article.id}
							articleTitle={article.title}
							index={index}
						/>
					))}
				</div>
			</CollapsibleSection>
		</section>
	);
}
