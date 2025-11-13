import { useLocalStorage } from "@/hooks/useLocalStorage";
import { EditorCardVertical } from "@/components/layout/sideColumn/EditorCardVertical";
import { CATIRE_EDITORS, CAT_FACTS } from "@/components/layout/sideColumn/constants";
import { CatFactsCard } from "@/components/layout/sideColumn/CatFactsCard";
import type {
	EditorCardProps,
	CatFactsProps,
} from "@/components/layout/sideColumn/type";
import { ExpandableSection } from "./ExpandableSection";

export function HomeContentSections() {
	const [expandEditors, setExpandEditors] = useLocalStorage<boolean>(
		"home_our_editors_expand",
		true
	);
	const [expandCatFacts, setExpandCatFacts] = useLocalStorage<boolean>(
		"home_cat_facts_expand",
		true
	);

	return (
		<div className="space-y-6 pt-6">
			<ExpandableSection
				title="OUR EDITORS"
				isExpanded={expandEditors}
				onToggle={() => setExpandEditors(!expandEditors)}
				contentClassName="flex flex-row overflow-x-auto overflow-y-hidden hide-scrollbar space-x-4"
			>
				{CATIRE_EDITORS.map((editor: EditorCardProps, index: number) => (
					<EditorCardVertical
						key={`editor-${index}`}
						name={editor.name}
						role={editor.role}
						description={editor.description}
						imageUrl={editor.imageUrl}
					/>
				))}
			</ExpandableSection>

			<ExpandableSection
				title="CAT FACTS"
				isExpanded={expandCatFacts}
				onToggle={() => setExpandCatFacts(!expandCatFacts)}
				contentClassName={`flex w-full gap-4 pt-4 hide-scrollbar overflow-y-hidden ${
					expandCatFacts ? "overflow-x-auto" : "overflow-hidden"
				}`}
			>
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
			</ExpandableSection>
		</div>
	);
}
