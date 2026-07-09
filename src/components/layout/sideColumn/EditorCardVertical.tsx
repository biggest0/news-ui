import { BASE_URL } from "@/config/config";
import type { EditorCardProps } from "@/types/props/sideColumnTypes";

export const EditorCardVertical = ({
	name,
	role,
	description,
	imageUrl,
}: EditorCardProps) => {
	return (
		<div className="flex flex-col items-center text-center space-y-4 w-1/3 border-b border-border-subtle bg-gradient-to-b py-4">
			{/* Image */}
			<img
				src={`${BASE_URL}images/${imageUrl}`}
				alt={name}
				className="w-28 h-28 object-cover rounded-xl"
			/>

			{/* Text */}
			<div>
				<div className="font-semibold text-foreground">{name}</div>
				<div className="text-foreground-secondary">{role}</div>
			</div>
      {/* Text */}
			<div className="text-sm text-muted-foreground max-w-sm break-words">
				{description}
			</div>
		</div>
	);
};
