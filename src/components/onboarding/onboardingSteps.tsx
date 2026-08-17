import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
	HiMagnifyingGlass,
	HiMiniLanguage,
	HiNewspaper,
	HiSparkles,
	HiSquares2X2,
	HiUserCircle,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import type { ParseKeys } from "i18next";

import { Button, buttonVariants } from "@/components/ui/Button";
import ThemeSelector from "@/components/common/theme/ThemeSelector";
import { useAppSettings } from "@/contexts/AppSettingContext";
import LanguageChoice from "@/components/onboarding/controls/LanguageChoice";
import ReadingModeChoice from "@/components/onboarding/controls/ReadingModeChoice";

export interface OnboardingControlProps {
	/** Closes the tour. Call this before navigating away from the page. */
	onDismiss: () => void;
}

export interface OnboardingStep {
	id: string;
	icon: IconType;
	// ParseKeys, not string: i18next.d.ts types t() against en/common.json, so a
	// plain string is rejected at the call site and a typo here fails the build
	titleKey: ParseKeys;
	bodyKey: ParseKeys;
	/** Optional interactive control rendered beneath the body copy. */
	Control?: ComponentType<OnboardingControlProps>;
	/** Dropped for signed-in visitors — nothing left to advertise. */
	hideWhenAuthenticated?: boolean;
}

// ── Per-slide controls ───────────────────────────────────────────────
// Each belongs to exactly one slide, so they live beside the manifest
// rather than in controls/, which holds the two reusable segmented pickers.

/** Preferences slide: the real language and theme controls, stacked. */
function PreferenceControls() {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col items-center gap-3">
			<div className="flex flex-col items-center gap-1.5">
				<span className="text-xs tracking-wide text-muted-foreground uppercase">
					{t("ONBOARDING.PREFERENCES.LANGUAGE_LABEL")}
				</span>
				<LanguageChoice />
			</div>
			<div className="flex flex-col items-center gap-1.5">
				<span className="text-xs tracking-wide text-muted-foreground uppercase">
					{t("ONBOARDING.PREFERENCES.THEME_LABEL")}
				</span>
				<ThemeSelector />
			</div>
		</div>
	);
}

/**
 * Sections slide: the same full reset the section menus expose. Shown here so
 * a first-time visitor sees the way back *before* they start removing things.
 */
function ResetLayoutButton() {
	const { t } = useTranslation();
	const { resetSectionVisibility } = useAppSettings();
	return (
		<Button variant="outline" size="sm" onClick={() => resetSectionVisibility()}>
			{t("ONBOARDING.SECTIONS.RESET")}
		</Button>
	);
}

/** Account slide: sign-up call to action. */
function AccountCta({ onDismiss }: OnboardingControlProps) {
	const { t } = useTranslation();
	return (
		<Link
			to="/register"
			onClick={onDismiss}
			className={buttonVariants({ variant: "default", size: "sm" })}
		>
			{t("ONBOARDING.ACCOUNT.CTA")}
		</Link>
	);
}

// ── The manifest ─────────────────────────────────────────────────────

/**
 * The tour, as data. Reordering, dropping or adding a slide is a one-line
 * change here — nothing else needs to know how many there are.
 */
export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
	{
		id: "welcome",
		icon: HiSparkles,
		titleKey: "ONBOARDING.WELCOME.TITLE",
		bodyKey: "ONBOARDING.WELCOME.BODY",
	},
	{
		id: "preferences",
		icon: HiMiniLanguage,
		titleKey: "ONBOARDING.PREFERENCES.TITLE",
		bodyKey: "ONBOARDING.PREFERENCES.BODY",
		Control: PreferenceControls,
	},
	{
		id: "reading",
		icon: HiNewspaper,
		titleKey: "ONBOARDING.READING.TITLE",
		bodyKey: "ONBOARDING.READING.BODY",
		Control: ReadingModeChoice,
	},
	{
		id: "sections",
		icon: HiSquares2X2,
		titleKey: "ONBOARDING.SECTIONS.TITLE",
		bodyKey: "ONBOARDING.SECTIONS.BODY",
		Control: ResetLayoutButton,
	},
	{
		id: "browse",
		icon: HiMagnifyingGlass,
		titleKey: "ONBOARDING.BROWSE.TITLE",
		bodyKey: "ONBOARDING.BROWSE.BODY",
	},
	{
		id: "account",
		icon: HiUserCircle,
		titleKey: "ONBOARDING.ACCOUNT.TITLE",
		bodyKey: "ONBOARDING.ACCOUNT.BODY",
		Control: AccountCta,
		hideWhenAuthenticated: true,
	},
];

/**
 * The slides an individual visitor should see.
 * @param isAuthenticated - Whether the visitor is signed in
 * @returns The filtered step list; step counts and dots derive from this
 */
export function getOnboardingSteps(isAuthenticated: boolean): OnboardingStep[] {
	return ONBOARDING_STEPS.filter(
		(step) => !(step.hideWhenAuthenticated && isAuthenticated)
	);
}
