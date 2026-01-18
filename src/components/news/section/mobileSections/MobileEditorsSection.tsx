import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { CATIRE_EDITORS } from "@/components/layout/sideColumn/constants";
import CollapsibleSection from "../CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { EditorCardVertical } from "@/components/layout/sideColumn/EditorCardVertical";
import type { EditorCardProps } from "@/types/props/sideColumnTypes";

export default function MobileEditorsSection() {
	const isVisible = useSectionVisible(SECTIONS.EDITORS);

	return (
		<section
			className={`md:hidden py-6 border-b border-gray-400 ${
				isVisible ? "" : "hidden"
			}`}
		>
			{/* instead pass in an enum maybe, this enum will give the title, and enum will map to correct options being created */}
			<SectionHeaderExpandable title="OUR EDITORS" section={SECTIONS.EDITORS} />
			<CollapsibleSection section={SECTIONS.EDITORS}>
				<div className="flex flex-row overflow-x-auto overflow-y-hidden hide-scrollbar space-x-4">
					{CATIRE_EDITORS.map((editor: EditorCardProps, index: number) => (
						<EditorCardVertical
							key={`editor-${index}`}
							name={editor.name}
							role={editor.role}
							description={editor.description}
							imageUrl={editor.imageUrl}
						/>
					))}
				</div>
			</CollapsibleSection>
		</section>
	);
}
