import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import OnboardingSlide from "@/components/onboarding/OnboardingSlide";
import { getOnboardingSteps } from "@/components/onboarding/onboardingSteps";

/**
 * The "how to use this site" tour: a stepped carousel in a modal dialog.
 *
 * Mounted once at App level so the mobile menu and About page can open it from
 * any route; the first-visit timing lives in OnboardingAutoOpen instead.
 *
 * Slides come from the onboardingSteps manifest, filtered by auth state — the
 * step count, the dots and "Step X of Y" all derive from that filtered list, so
 * adding or dropping a slide needs no changes here.
 */
export default function OnboardingTour() {
	const { t } = useTranslation();
	const { isOpen, close } = useOnboarding();
	const { isAuthenticated } = useAuth();

	const steps = useMemo(
		() => getOnboardingSteps(isAuthenticated),
		[isAuthenticated]
	);

	const [stepIndex, setStepIndex] = useState(0);
	const headingRef = useRef<HTMLHeadingElement>(null);

	const totalSteps = steps.length;
	const step = steps[Math.min(stepIndex, totalSteps - 1)];
	const isFirstStep = stepIndex === 0;
	const isLastStep = stepIndex >= totalSteps - 1;

	// Always start from the beginning, including on a later manual re-open
	useEffect(() => {
		if (isOpen) setStepIndex(0);
	}, [isOpen]);

	// Pull focus to the new slide's heading so screen readers announce it
	// rather than leaving focus parked on the Next button.
	useEffect(() => {
		if (!isOpen) return;
		headingRef.current?.focus();
	}, [stepIndex, isOpen]);

	const goToPreviousStep = () => setStepIndex((index) => Math.max(0, index - 1));

	const goToNextStep = () => {
		if (isLastStep) {
			close("completed");
			return;
		}
		setStepIndex((index) => Math.min(totalSteps - 1, index + 1));
	};

	/** Arrow keys walk the carousel; Escape is handled by the dialog itself. */
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "ArrowRight" && !isLastStep) {
			event.preventDefault();
			setStepIndex((index) => index + 1);
		}
		if (event.key === "ArrowLeft" && !isFirstStep) {
			event.preventDefault();
			setStepIndex((index) => index - 1);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				// Only fires for dialog-initiated closes (Escape, backdrop press,
				// the X). Skip and Finish call close() directly with their own
				// reason, and changing `open` from outside doesn't re-enter here.
				if (!open) close("closed");
			}}
		>
			<DialogContent
				onKeyDown={handleKeyDown}
				initialFocus={headingRef}
				className="max-h-[90dvh] overflow-y-auto"
			>
				<DialogHeader className="pb-2">
					<DialogTitle>{t("ONBOARDING.TITLE")}</DialogTitle>
					{/* Doubles as the dialog's description and the live step counter */}
					<DialogDescription aria-live="polite">
						{t("ONBOARDING.STEP_OF", {
							current: stepIndex + 1,
							total: totalSteps,
						})}
					</DialogDescription>
				</DialogHeader>

				<OnboardingSlide
					icon={step.icon}
					title={t(step.titleKey)}
					body={t(step.bodyKey)}
					headingRef={headingRef}
				>
					{step.Control && <step.Control onDismiss={() => close("closed")} />}
				</OnboardingSlide>

				{/* Real buttons, not decoration: each dot jumps to its slide */}
				<div className="flex justify-center gap-2 pt-6">
					{steps.map((dotStep, index) => (
						<button
							key={dotStep.id}
							type="button"
							onClick={() => setStepIndex(index)}
							aria-label={t("ONBOARDING.DOT_LABEL", { step: index + 1 })}
							aria-current={index === stepIndex ? "step" : undefined}
							className={`h-2 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none ${
								index === stepIndex
									? "w-5 bg-brand"
									: "w-2 bg-border hover:bg-muted-foreground"
							}`}
						/>
					))}
				</div>

				<DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
					<Button variant="ghost" size="sm" onClick={() => close("skipped")}>
						{t("ONBOARDING.SKIP")}
					</Button>

					<div className="flex items-center gap-2">
						{!isFirstStep && (
							<Button variant="outline" size="sm" onClick={goToPreviousStep}>
								{t("ONBOARDING.BACK")}
							</Button>
						)}
						<Button size="sm" onClick={goToNextStep}>
							{isLastStep ? t("ONBOARDING.FINISH") : t("ONBOARDING.NEXT")}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
