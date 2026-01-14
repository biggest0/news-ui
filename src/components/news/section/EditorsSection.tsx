import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { CATIRE_EDITORS } from "@/components/layout/sideColumn/constants";
import { EditorCardHorizontal } from "@/components/layout/sideColumn/EditorCardHorizontal";
import CollapsibleSection from "./CollapsibleSection";

export default function EditorsSection() {
	return (
		<section>
			<SectionHeaderExpandable title="OUR EDITORS" />
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
