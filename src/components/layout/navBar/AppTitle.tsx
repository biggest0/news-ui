import { Link } from "react-router-dom";

import { PAGE_ROUTES } from "@/constants/routes";

interface AppTitleProps {
	variant?: "desktop" | "mobile";
}

/**
 * Brand wordmark. Links home, as readers (and crawlers) expect a masthead to:
 * the house icon in AppLogo is the other, icon-only route to the front page.
 */
export const AppTitle = ({ variant = "desktop" }: AppTitleProps) => {
	const tailwindClasses =
		variant === "desktop"
			? "absolute left-1/2 transform -translate-x-1/2 text-3xl lg:text-5xl font-semibold text-foreground tracking-wide"
			: "text-xl font-semibold text-foreground tracking-wide";

	return (
		<Link to={PAGE_ROUTES.HOME} className={tailwindClasses}>
			<span className="relative inline-block">
				<span className="relative z-10">Ç</span>
				<img
					src="/images/app_title_background_cat.svg"
					alt=""
					className="absolute top-[52%] md:top-[54%] lg:top-[57%] left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-4 h-4 md:w-6 md:h-6 lg:w-9 lg:h-9 dark:invert dark:opacity-80"
				/>
			</span>
			{"ATIRE TIME" /* brand wordmark — intentionally untranslated */}
		</Link>
	);
};
