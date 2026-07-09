import { useTranslation } from "react-i18next";

import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { SectionShell } from "@/components/common/layout/SectionShell";
import { CATIRE_EDITORS } from "@/components/layout/sideColumn/constants";
import { EditorCardHorizontal } from "@/components/layout/sideColumn/EditorCardHorizontal";
import { EditorCardVertical } from "@/components/layout/sideColumn/EditorCardVertical";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import { SECTIONS } from "@/constants/keys";
import { useSectionVisible } from "@/hooks/useSectionCollapse";

interface EditorsSectionProps {
	/**
	 * "sidebar" (default): stacked horizontal cards in the desktop side column.
	 * "mobile": md:hidden bordered section with a horizontal scroll of vertical cards.
	 */
	variant?: "sidebar" | "mobile";
}

/**
 * "Our Editors" section. One component for both placements — the former
 * MobileEditorsSection was a ~90% duplicate and is consolidated here behind
 * the `variant` prop.
 */
export default function EditorsSection({
	variant = "sidebar",
}: EditorsSectionProps) {
	const isVisible = useSectionVisible(SECTIONS.EDITORS);
	const { t } = useTranslation();

	const isMobile = variant === "mobile";

	const cards = CATIRE_EDITORS.map((editor, index) =>
		isMobile ? (
			<EditorCardVertical
				key={`editor-${index}`}
				name={t(`EDITORS.${editor.translationKey}.NAME`)}
				role={t(`EDITORS.${editor.translationKey}.ROLE`)}
				description={t(`EDITORS.${editor.translationKey}.DESCRIPTION`)}
				imageUrl={editor.imageUrl}
			/>
		) : (
			<EditorCardHorizontal
				key={`editor-${index}`}
				name={t(`EDITORS.${editor.translationKey}.NAME`)}
				role={t(`EDITORS.${editor.translationKey}.ROLE`)}
				description={t(`EDITORS.${editor.translationKey}.DESCRIPTION`)}
				imageUrl={editor.imageUrl}
			/>
		)
	);

	return (
		<SectionShell visible={isVisible} bordered={isMobile} mobileOnly={isMobile}>
			<SectionHeaderExpandable
				title={t("SECTION.OUR_EDITORS")}
				section={SECTIONS.EDITORS}
			/>
			<CollapsibleSection section={SECTIONS.EDITORS}>
				{isMobile ? (
					<div className="flex flex-row overflow-x-auto overflow-y-hidden hide-scrollbar space-x-4">
						{cards}
					</div>
				) : (
					cards
				)}
			</CollapsibleSection>
		</SectionShell>
	);
}
