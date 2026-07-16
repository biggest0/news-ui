interface SectionHeaderProps {
	title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
	return <h2 className="text-muted-foreground pb-4">{title.toUpperCase()}</h2>;
};
