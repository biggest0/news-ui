interface SectionHeaderProps {
	title: string;
	/**
	 * Heading level. Defaults to `h2` — correct when this labels one section
	 * among several. Pass `h1` when the section *is* the page (category feeds,
	 * static pages), so every route has exactly one top-level heading.
	 */
	as?: "h1" | "h2";
}

export const SectionHeader = ({ title, as: Heading = "h2" }: SectionHeaderProps) => {
	return (
		// text-section-label, not text-brand: brand means "interactive" in this
		// palette and these labels sit right beside a real control (the options
		// chevron), so sharing its colour would imply the label is clickable too.
		<Heading className="text-section-label pb-4">{title.toUpperCase()}</Heading>
	);
};
