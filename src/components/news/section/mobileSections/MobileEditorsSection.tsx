import { useTranslation } from "react-i18next";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { CATIRE_EDITORS } from "@/components/layout/sideColumn/constants";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { EditorCardVertical } from "@/components/layout/sideColumn/EditorCardVertical";

export default function MobileEditorsSection() {
	const isVisible = useSectionVisible(SECTIONS.EDITORS);
	const { t } = useTranslation();

	return (
		<section
			className={`md:hidden py-6 border-b border-gray-400 ${
				isVisible ? "" : "hidden"
			}`}
		>
			{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
			<SectionHeaderExpandable
				title={t("SECTION.OUR_EDITORS")}
				section={SECTIONS.EDITORS}
			/>
			<CollapsibleSection section={SECTIONS.EDITORS}>
				<div className="flex flex-row overflow-x-auto overflow-y-hidden hide-scrollbar space-x-4">
					{CATIRE_EDITORS.map((editor, index) => (
						<EditorCardVertical
							key={`editor-${index}`}
							name={t(`EDITORS.${editor.translationKey}.NAME`)}
							role={t(`EDITORS.${editor.translationKey}.ROLE`)}
							description={t(`EDITORS.${editor.translationKey}.DESCRIPTION`)}
							imageUrl={editor.imageUrl}
						/>
					))}
				</div>
			</CollapsibleSection>
		</section>
	);
}
