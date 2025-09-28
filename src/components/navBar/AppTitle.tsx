interface AppTitleProps {
	variant?: "desktop" | "mobile";
}

export const AppTitle = ({ variant = "desktop" }: AppTitleProps) => {
	const tailwindClasses =
		variant === "desktop"
			? "absolute left-1/2 transform -translate-x-1/2 lg:text-5xl font-semibold text-gray-800 tracking-wide"
			: "text-lg font-semibold text-gray-800 tracking-wide";

	return <div className={tailwindClasses}>THE CATIRE TIMES</div>;
};
