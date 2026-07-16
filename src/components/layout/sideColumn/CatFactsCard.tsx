import type { CatFactsProps } from "@/types/props/sideColumnTypes";

export const CatFactsCard = ({ title, fact, small }: CatFactsProps) => {
	return (
		<>
			{small ? (
				<div className="min-h-24 flex-shrink-0 w-64">
					<div className="text-base font-semibold text-foreground">{title}</div>
					<div className="text-sm">{fact}</div>
				</div>
			) : (
				<div className="flex flex-col justify-between border-b border-border py-4">
					<h3>{title}</h3>
					<div>{fact}</div>
				</div>
			)}
		</>
	);
};
