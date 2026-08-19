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
		<Heading className="text-muted-foreground pb-4">{title.toUpperCase()}</Heading>
	);
};
