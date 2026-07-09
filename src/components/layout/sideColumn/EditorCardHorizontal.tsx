import { BASE_URL } from "@/config/config";

interface EditorCardProps {
	name: string;
	role: string;
	description: string;
	imageUrl: string;
}

export const EditorCardHorizontal = ({
	name,
	role,
	description,
	imageUrl,
}: EditorCardProps) => {
	return (
		<div className="border-b border-border py-4">
			<div className="flex flex-row space-x-8 items-stretch justify-between w-full">
				{/* Text */}
				<div className="flex flex-col justify-between max-w-sm">
					<div className="flex flex-col">
						<div className="text-foreground">{name}</div>
						<div className="text-foreground-secondary">{role}</div>
					</div>
					<div className="text-sm text-muted-foreground whitespace-normal break-words">
						{description}
					</div>
				</div>

				{/* Image */}
				<img
					src={`${BASE_URL}images/${imageUrl}`}
					alt=""
					className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
				/>
			</div>
		</div>
	);
};
