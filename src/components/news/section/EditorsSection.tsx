import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { CATIRE_EDITORS } from "@/components/layout/sideColumn/constants";
import { EditorCardHorizontal } from "@/components/layout/sideColumn/EditorCardHorizontal";
import CollapsibleSection from "./CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { useTranslation } from "react-i18next";

export default function EditorsSection() {
	const isVisible = useSectionVisible(SECTIONS.EDITORS);
	const { t } = useTranslation();

	return (
		<section className={`${isVisible ? "" : "hidden"}`}>
			{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
			<SectionHeaderExpandable
				title={t("SECTION.OUR_EDITORS")}
				section={SECTIONS.EDITORS}
			/>
			<CollapsibleSection section={SECTIONS.EDITORS}>
				{CATIRE_EDITORS.map((editor, index) => (
					<EditorCardHorizontal
						key={`editor-${index}`}
						name={t(`EDITORS.${editor.translationKey}.NAME`)}
						role={t(`EDITORS.${editor.translationKey}.ROLE`)}
						description={t(`EDITORS.${editor.translationKey}.DESCRIPTION`)}
						imageUrl={editor.imageUrl}
					/>
				))}
			</CollapsibleSection>
		</section>
	);
}
