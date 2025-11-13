interface HamburgerButtonProps {
	isOpen: boolean;
	onClick: () => void;
}

export const HamburgerButton = ({ isOpen, onClick }: HamburgerButtonProps) => {
	return (
		<button
			onClick={onClick}
			className="w-6 h-6 flex flex-col justify-center items-center cursor-pointer group"
			aria-label="Toggle menu"
		>
			<span
				className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
					isOpen ? "rotate-45 translate-y-1.5" : ""
				}`}
			/>
			<span
				className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${
					isOpen ? "opacity-0" : ""
				}`}
			/>
			<span
				className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${
					isOpen ? "-rotate-45 -translate-y-1.5" : ""
				}`}
			/>
		</button>
	);
};
