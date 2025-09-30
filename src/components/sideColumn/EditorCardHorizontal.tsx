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
		<div className="border-b border-gray-400 py-4">
			<div className="flex flex-row space-x-8 items-center justify-between w-full">
				{/* Text */}
				<div className="flex flex-col justify-between min-h-24 max-h-full max-w-sm">
					<div className="flex flex-col">
						<div>{name}</div>
						<div>{role}</div>
					</div>
					<div className="text-sm text-gray-500 whitespace-normal break-words">
						{description}
					</div>
				</div>

				{/* Image */}
				<img
					src={`/images/${imageUrl}`}
					alt=""
					className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
				/>
			</div>
		</div>
	);
};
