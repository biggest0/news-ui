import { SectionHeader } from "./SectionHeader";
import { SectionDropDown } from "./SectionDropDown";

interface SectionHeaderExpandableProps {
	title: string;
}

export const SectionHeaderExpandable = ({
	title,
}: SectionHeaderExpandableProps) => {
	return (
		<div className="flex flex-row items-center space-x-4">
			<SectionHeader title={title} />
			<SectionDropDown />
		</div>
	);
};
