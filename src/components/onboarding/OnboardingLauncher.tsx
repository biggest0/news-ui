import { useTranslation } from "react-i18next";

import { useOnboarding } from "@/contexts/OnboardingContext";

interface OnboardingLauncherProps {
	/**
	 * "link" (default): an underlined text link, matching the About page's
	 * "Full Disclaimer" link.
	 * "footer": a quiet inline link matching the site footer's bottom bar,
	 * for the mobile drawer's footer row.
	 */
	variant?: "link" | "footer";
	/**
	 * Runs just before the tour opens. The mobile drawer passes its close
	 * handler here — leaving it open would stack two dialogs, and the drawer
	 * would sit on top of the tour it just launched.
	 */
	onOpen?: () => void;
}

/**
 * Re-opens the "how to use this site" tour after it has been dismissed.
 *
 * Deliberately low-key: it lives only in the mobile drawer and on the About
 * page, not in the header or footer. Someone who dismissed the tour chose to,
 * and the content isn't make-or-break.
 *
 * Focus return needs no ref plumbing — base-ui's Dialog defaults `finalFocus`
 * to the previously focused element, which is this button.
 */
export default function OnboardingLauncher({
	variant = "link",
	onOpen,
}: OnboardingLauncherProps) {
	const { t } = useTranslation();
	const { open } = useOnboarding();

	const handleClick = () => {
		onOpen?.();
		open();
	};

	if (variant === "footer") {
		return (
			<button
				type="button"
				onClick={handleClick}
				className="cursor-pointer transition-colors hover:text-foreground"
			>
				{t("ONBOARDING.REOPEN")}
			</button>
		);
	}

	// A real <button>, not a Link: it opens a dialog rather than navigating.
	// Styled to match the adjacent "Full Disclaimer" link on the About page.
	return (
		<button
			type="button"
			onClick={handleClick}
			className="cursor-pointer text-muted-foreground underline hover:text-foreground"
		>
			{t("ONBOARDING.REOPEN")}
		</button>
	);
}
