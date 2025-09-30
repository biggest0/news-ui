import type { CatFactsProps } from "./type";

export const CatFactsCard = ({ title, fact, small }: CatFactsProps) => {
	return (
		<>
			{small ? (
				<div className="min-h-24 flex-shrink-0 w-64">
					<div className="text-base font-semibold text-gray-800">{title}</div>
					<div className="text-sm">{fact}</div>
				</div>
			) : (
				<div className="flex flex-col justify-between border-b border-gray-400 py-4">
					<h4>{title}</h4>
					<div>{fact}</div>
				</div>
			)}
		</>
	);
};
