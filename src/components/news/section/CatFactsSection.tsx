import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { SectionShell } from "@/components/common/layout/SectionShell";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { CatFactsCard } from "@/components/layout/sideColumn/CatFactsCard";
import type { AppDispatch, RootState } from "@/store/store";
import { loadCatFacts } from "@/store/catFactsSlice";

interface CatFactsSectionProps {
	/**
	 * "sidebar" (default): stacked full-size cards in the desktop side column.
	 * "mobile": md:hidden bordered section with a horizontal scroll of small cards.
	 */
	variant?: "sidebar" | "mobile";
}

/**
 * "Cat Facts" section (server-decided, localized facts). One component for
 * both placements — the former MobileCatFactsSection was a ~90% duplicate and
 * is consolidated here behind the `variant` prop.
 */
export default function CatFactsSection({
	variant = "sidebar",
}: CatFactsSectionProps) {
	const { t } = useTranslation();
	const isVisible = useSectionVisible(SECTIONS.CAT_FACTS);
	const dispatch = useDispatch<AppDispatch>();
	const catFacts = useSelector((state: RootState) => state.catFacts.facts);

	// server-decided facts; thunk dedupes if another section already loaded them
	useEffect(() => {
		dispatch(loadCatFacts());
	}, [dispatch]);

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
				{isMobile ? (
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
