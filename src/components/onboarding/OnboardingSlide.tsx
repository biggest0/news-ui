import type { ReactNode, Ref } from "react";
import type { IconType } from "react-icons";

interface OnboardingSlideProps {
	icon: IconType;
	title: string;
	body: string;
	/**
	 * The tour moves focus here on every step change so screen readers announce
	 * the new slide instead of leaving focus on the Next button.
	 */
	headingRef?: Ref<HTMLHeadingElement>;
	/** Optional live control (language, theme, reading mode, a link out…). */
	children?: ReactNode;
}

/**
 * One slide of the onboarding tour: icon, heading, body copy, and an optional
 * interactive control underneath. Purely presentational — all strings arrive
 * already translated, and the step data lives in onboardingSteps.tsx.
 */
export default function OnboardingSlide({
	icon: Icon,
	title,
	body,
	headingRef,
	children,
}: OnboardingSlideProps) {
	return (
		<div
			data-slot="onboarding-slide"
			className="flex flex-col items-center gap-3 px-6 text-center"
		>
			<span
				className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-brand"
				aria-hidden="true"
			>
				<Icon className="h-6 w-6" />
			</span>

			{/* tabIndex allows programmatic focus without adding a tab stop */}
			<h3
				ref={headingRef}
				tabIndex={-1}
				className="font-heading text-lg font-semibold text-foreground outline-none"
			>
				{title}
			</h3>

			<p className="text-sm leading-relaxed text-foreground-secondary">{body}</p>

			{children && <div className="mt-2 flex w-full justify-center">{children}</div>}
		</div>
	);
}
