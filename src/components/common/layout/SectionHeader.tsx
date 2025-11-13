interface SectionHeaderProps {
	title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
	return <h3 className="text-gray-500 pb-4">{title}</h3>;
};
