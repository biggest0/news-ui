import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import CollapsibleSection from "./CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { CatFactsCard } from "@/components/layout/sideColumn/CatFactsCard";
import type { AppDispatch, RootState } from "@/store/store";
import { loadCatFacts } from "@/store/catFactsSlice";

export default function CatFactsSection() {
	const { t } = useTranslation();
	const isVisible = useSectionVisible(SECTIONS.CAT_FACTS);
	const dispatch = useDispatch<AppDispatch>();
	const catFacts = useSelector((state: RootState) => state.catFacts.facts);

	// server-decided facts; thunk dedupes if another section already loaded them
	useEffect(() => {
		dispatch(loadCatFacts());
	}, [dispatch]);

	return (
		<section className={`${isVisible ? "" : "hidden"}`}>
			{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
			<SectionHeaderExpandable
				title={t("SECTION.CAT_FACTS")}
				section={SECTIONS.CAT_FACTS}
			/>
			<CollapsibleSection section={SECTIONS.CAT_FACTS}>
				{catFacts.map((catFact) => (
					<CatFactsCard
						key={catFact.id}
						title={catFact.title}
						fact={catFact.fact}
						small={false}
					/>
				))}
			</CollapsibleSection>
		</section>
	);
}
