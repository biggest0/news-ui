interface LoadingMessageProps {
	isLoading: boolean;
}

export function LoadingMessage({ isLoading }: LoadingMessageProps) {
	return (
		<div className="text-center text-gray-500 py-4">
			{isLoading
				? "Just a few seoncds, articles are coming!"
				: "You've scrolled to the end. There's nothing left!"}
		</div>
	);
}
