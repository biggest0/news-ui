import type { SectionToggleState } from "@/types/localStorageTypes";

interface EmptyStateSectionProps {
	isVisible: boolean;
	resetSectionVisibility: (key?: keyof SectionToggleState) => void;
	message: string;
	buttonText: string;
}

export default function EmptyStateSection({
	isVisible,
	resetSectionVisibility,
	message,
	buttonText,
}: EmptyStateSectionProps) {
	return (
		<section className={`${isVisible ? "" : "hidden"}`}>
			<div className="flex flex-col p-8 items-center text-center gap-4">
				{/* Add cat illustration later*/}

				{/* Text content */}
				<div className="space-y-2">
					<p className="text-sm font-medium text-gray-800">{message}</p>
				</div>

				{/* Reset button */}
				<button
					className="underline text-gray-800 text-sm rounded-lg hover:text-amber-600 transition-colors duration-200 cursor-pointer"
					onClick={() => resetSectionVisibility()}
				>
					{buttonText}
				</button>
			</div>
		</section>
	);
}
