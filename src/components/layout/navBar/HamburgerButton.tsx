import { useTranslation } from "react-i18next";

interface HamburgerButtonProps {
	isOpen: boolean;
	onClick: () => void;
	/** React 19 ref-as-prop — lets the mobile drawer return focus here on close. */
	ref?: React.Ref<HTMLButtonElement>;
}

export const HamburgerButton = ({ isOpen, onClick, ref }: HamburgerButtonProps) => {
	const { t } = useTranslation();
	return (
		<button
			ref={ref}
			onClick={onClick}
			className="w-6 h-6 flex flex-col justify-center items-center cursor-pointer group"
			aria-label={t("NAVIGATION.TOGGLE_MENU")}
		>
			<span
				className={`w-5 h-0.5 bg-foreground-secondary transition-all duration-300 ${
					isOpen ? "rotate-45 translate-y-1.5" : ""
				}`}
			/>
			<span
				className={`w-5 h-0.5 bg-foreground-secondary transition-all duration-300 mt-1 ${
					isOpen ? "opacity-0" : ""
				}`}
			/>
			<span
				className={`w-5 h-0.5 bg-foreground-secondary transition-all duration-300 mt-1 ${
					isOpen ? "-rotate-45 -translate-y-1.5" : ""
				}`}
			/>
		</button>
	);
};
