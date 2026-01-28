import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { CAT_FACTS } from "@/components/layout/sideColumn/constants";
import CollapsibleSection from "./CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { CatFactsCard } from "@/components/layout/sideColumn/CatFactsCard";
import { useTranslation } from "react-i18next";

export default function CatFactsSection() {
	const { t } = useTranslation();
	const isVisible = useSectionVisible(SECTIONS.CAT_FACTS);

	return (
		<section className={`${isVisible ? "" : "hidden"}`}>
			{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
			<SectionHeaderExpandable
				title={t("SECTION.CAT_FACTS")}
				section={SECTIONS.CAT_FACTS}
			/>
			<CollapsibleSection section={SECTIONS.CAT_FACTS}>
				{CAT_FACTS.map((catFact, index) => (
					<CatFactsCard
						key={index}
						title={catFact.title}
						fact={catFact.fact}
						small={false}
					/>
				))}
			</CollapsibleSection>
		</section>
	);
}
