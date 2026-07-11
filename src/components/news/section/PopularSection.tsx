import { useTranslation } from "react-i18next";

import { ArticleTitleCard } from "@/components/news/cards/ArticleTitleCard";
import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { SectionShell } from "@/components/common/layout/SectionShell";
import CollapsibleSection from "./CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { useApiLang } from "@/hooks/useApiLang";
import { useGetTopTenQuery } from "@/store/api/articleEndpoints";

/** Top-ten most-viewed articles — RTK Query consumer. */
export default function PopularSection() {
	const { t } = useTranslation();
	const isVisible = useSectionVisible(SECTIONS.POPULAR);
	const lang = useApiLang();
	const { data: topTenArticles = [] } = useGetTopTenQuery({ lang });

	return (
		<SectionShell visible={isVisible} bordered>
			<SectionHeaderExpandable
				title={t("SECTION.POPULAR")}
				section={SECTIONS.POPULAR}
			/>
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
		</SectionShell>
	);
}
