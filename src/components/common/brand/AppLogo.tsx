import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuHouse } from "react-icons/lu";

interface LogoProps {
	size?: "sm" | "md";
}

/** Home link rendered as a house icon (placeholder until a real logo exists). */
export const AppLogo = ({ size = "md" }: LogoProps) => {
	const { t } = useTranslation();
	const sizeClasses = {
		sm: "w-5 h-5",
		md: "w-6 h-6",
	};

	return (
		<Link to="/" aria-label={t("NAVIGATION.HOME")}>
			<LuHouse
				className={`${sizeClasses[size]} hover:text-foreground cursor-pointer transition-colors`}
			/>
		</Link>
		// To DO: Replace with actual logo image (maybe)
		// <a href="">
		// 	<img src="test-logo.png" alt="" className={`${sizeClasses[size]} hover:text-black cursor-pointer`}/>
		// </a>
	);
};
