interface SectionHeaderProps {
	title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
	return <h3 className="text-muted pb-4">{title.toUpperCase()}</h3>;
};
