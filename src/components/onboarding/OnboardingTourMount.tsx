import { Suspense, lazy, useEffect, useState } from "react";

import { useOnboarding } from "@/contexts/OnboardingContext";

const OnboardingTour = lazy(
	() => import("@/components/onboarding/OnboardingTour")
);

/**
 * Mounts the tour dialog only once it has actually been opened.
 *
 * The gate is the whole point of the lazy import: rendering
 * `<Suspense><OnboardingTour /></Suspense>` unconditionally would fetch the
 * chunk on every page load — the same bytes as bundling it, plus an extra
 * request. Deferring until first open means repeat visitors, who are the
 * majority, never download the tour at all.
 *
 * Once opened it stays mounted for the session, so re-opening from the mobile
 * menu or the About page is instant.
 */
export default function OnboardingTourMount() {
	const { isOpen } = useOnboarding();
	const [hasEverOpened, setHasEverOpened] = useState(false);

	useEffect(() => {
		if (isOpen) setHasEverOpened(true);
	}, [isOpen]);

	if (!hasEverOpened) return null;

	// null fallback: the dialog animates itself in once the chunk resolves
	return (
		<Suspense fallback={null}>
			<OnboardingTour />
		</Suspense>
	);
}
