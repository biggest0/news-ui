import type { CatFactsProps } from "./type";

export const CatFactsCard = ({ title, fact }: CatFactsProps) => {
	return (
		<div className="min-h-24 flex-shrink-0 w-64">
			<div className="text-base font-semibold text-gray-800">{title}</div>
			<div className="text-sm">{fact}</div>
		</div>
	);
};
