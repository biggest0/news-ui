import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { CAT_FACTS } from "@/components/layout/sideColumn/constants";
import CollapsibleSection from "../CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { CatFactsCard } from "@/components/layout/sideColumn/CatFactsCard";
import type { CatFactsProps } from "@/types/props/sideColumnTypes";

export default function MobileCatFactsSection() {
	const isVisible = useSectionVisible(SECTIONS.CAT_FACTS);

	return (
		<section
			className={`md:hidden py-6 border-b border-gray-400 ${
				isVisible ? "" : "hidden"
			}`}
		>
			{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
			<SectionHeaderExpandable title="CAT FACTS" section={SECTIONS.CAT_FACTS} />
			<CollapsibleSection section={SECTIONS.CAT_FACTS}>
				<div className="flex w-full gap-4 pt-4 hide-scrollbar overflow-y-hidden">
					{CAT_FACTS.map(
						(catFact: Omit<CatFactsProps, "small">, index: number) => (
							<CatFactsCard
								key={`cat-fact-${index}`}
								title={catFact.title}
								fact={catFact.fact}
								small={true}
							/>
						)
					)}
				</div>
			</CollapsibleSection>
		</section>
	);
}
