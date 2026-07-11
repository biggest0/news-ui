import { useTranslation } from "react-i18next";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { SectionShell } from "@/components/common/layout/SectionShell";
import { SectionErrorMessage } from "@/components/common/feedback/SectionErrorMessage";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { useApiLang } from "@/hooks/useApiLang";
import { CatFactsCard } from "@/components/layout/sideColumn/CatFactsCard";
import { useGetCatFactsQuery } from "@/store/api/catFactEndpoints";

interface CatFactsSectionProps {
	/**
	 * "sidebar" (default): stacked full-size cards in the desktop side column.
	 * "mobile": md:hidden bordered section with a horizontal scroll of small cards.
	 */
	variant?: "sidebar" | "mobile";
}

/**
 * "Cat Facts" section (server-decided, localized facts) — RTK Query consumer.
 * Both variants share one cache entry; a language switch changes the query
 * arg and refetches automatically.
 */
export default function CatFactsSection({
	variant = "sidebar",
}: CatFactsSectionProps) {
	const { t } = useTranslation();
	const isVisible = useSectionVisible(SECTIONS.CAT_FACTS);
	const lang = useApiLang();
	const {
		data: catFacts = [],
		isError,
		refetch,
	} = useGetCatFactsQuery({ lang });

	const isMobile = variant === "mobile";

	const cards = catFacts.map((catFact) => (
		<CatFactsCard
			key={`cat-fact-${catFact.id}`}
			title={catFact.title}
			fact={catFact.fact}
			small={isMobile}
		/>
	));

	return (
		<SectionShell visible={isVisible} bordered={isMobile} mobileOnly={isMobile}>
			<SectionHeaderExpandable
				title={t("SECTION.CAT_FACTS")}
				section={SECTIONS.CAT_FACTS}
			/>
			<CollapsibleSection section={SECTIONS.CAT_FACTS}>
				{isError ? (
					<SectionErrorMessage onRetry={refetch} />
				) : isMobile ? (
					<div className="flex w-full gap-4 pt-4 hide-scrollbar overflow-y-hidden">
						{cards}
					</div>
				) : (
					cards
				)}
			</CollapsibleSection>
		</SectionShell>
	);
}
