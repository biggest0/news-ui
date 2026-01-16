import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { CATIRE_EDITORS } from "@/components/layout/sideColumn/constants";
import { EditorCardHorizontal } from "@/components/layout/sideColumn/EditorCardHorizontal";
import CollapsibleSection from "./CollapsibleSection";
import { SECTIONS } from "@/constants/keys";

export default function EditorsSection() {
	return (
		<section>
			{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
			<SectionHeaderExpandable title="OUR EDITORS" section={SECTIONS.EDITORS} />
			<CollapsibleSection>
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
