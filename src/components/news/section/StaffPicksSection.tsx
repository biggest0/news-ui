import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { SectionShell } from "@/components/common/layout/SectionShell";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { useFeaturedArticles } from "@/hooks/useArticleHooks";
import { incrementArticleViewed } from "@/api/articleApi";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordArticleReadMutation } from "@/store/api/userContentEndpoints";

/**
 * Desktop side-column "Staff Picks": title links to the top featured
 * articles. Shares its data loading with MobileStaffPicksSection via
 * useFeaturedArticles (the mobile presentation differs enough — hero image +
 * card carousel — that the components stay separate by design).
 */
export default function StaffPicksSection() {
	const isVisible = useSectionVisible(SECTIONS.STAFF_PICKS);
	const { isAuthenticated } = useAuth();
	const { t } = useTranslation();
	const featuredArticles = useFeaturedArticles();
	// fire-and-forget: triggered without await (invalidates History)
	const [recordArticleRead] = useRecordArticleReadMutation();

	const handleClick = (articleId: string) => {
		incrementArticleViewed(articleId);
		if (isAuthenticated) {
			recordArticleRead(articleId);
		}
	};

	return (
		<SectionShell visible={isVisible}>
			<SectionHeaderExpandable
				title={t("SECTION.STAFF_PICKS")}
				section={SECTIONS.STAFF_PICKS}
			/>
			<CollapsibleSection section={SECTIONS.STAFF_PICKS}>
				<div className="border-b border-border py-4 space-y-4">
					{featuredArticles.slice(0, 5).map((article) => (
						<div key={`side-${article.id}`}>
							<Link
								to={`/article/${article.id}`}
								className="py-2 hover:text-brand transition-colors duration-200 cursor-pointer"
								onClick={() => handleClick(article.id)}
							>
								{article.title}
							</Link>
						</div>
					))}
				</div>
			</CollapsibleSection>
		</SectionShell>
	);
}
