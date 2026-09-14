import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuHouse } from "react-icons/lu";
import { PAGE_ROUTES } from "@/constants/routes";

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
		// Fixed 24px box whatever the glyph size: it matches the hamburger button
		// opposite in the mobile header, and `justify-between` there shifts the
		// centred wordmark by half of any difference between the two ends. It
		// also keeps the tap target at 24px when the icon inside is smaller.
		<Link
			to={PAGE_ROUTES.HOME}
			aria-label={t("NAVIGATION.HOME")}
			className="flex h-6 w-6 items-center justify-center"
		>
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
