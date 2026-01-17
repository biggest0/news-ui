import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { CATIRE_EDITORS } from "@/components/layout/sideColumn/constants";
import { EditorCardHorizontal } from "@/components/layout/sideColumn/EditorCardHorizontal";
import CollapsibleSection from "./CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";

export default function EditorsSection() {
	const isVisible = useSectionVisible(SECTIONS.EDITORS);

	return (
		<section className={`${isVisible ? "" : "hidden"}`}>
			{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
			<SectionHeaderExpandable title="OUR EDITORS" section={SECTIONS.EDITORS} />
			<CollapsibleSection section={SECTIONS.EDITORS}>
				{CATIRE_EDITORS.map((editor, index) => (
					<EditorCardHorizontal
						key={`editor-${index}`}
						name={editor.name}
						role={editor.role}
						description={editor.description}
						imageUrl={editor.imageUrl}
					/>
				))}
			</CollapsibleSection>
		</section>
	);
}
