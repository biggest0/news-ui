import { useEffect, useRef } from "react";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { useFeaturedArticles } from "@/hooks/useArticleHooks";

/** Settle delay so the dialog doesn't appear in the same frame content lands. */
const AUTO_OPEN_DELAY_MS = 600;

/**
 * Headless first-visit trigger for the onboarding tour. Renders nothing.
 *
 * Mounted by HomePage, which is what makes "home page only" structural — there
 * is no pathname string to keep in sync with the router, and the component
 * simply doesn't exist on other routes.
 *
 * It waits for featured articles before opening. `HomeNewsSection` renders
 * `<BaseNewsSection overlayOnInitialLoad />`, and that LoadingOverlay is a
 * `fixed inset-0` panel with a solid background — a full-screen loading screen.
 * The tour's dialog is portaled to the end of <body> at the same z-index, so
 * without this gate it would paint on top of that overlay on a cold load.
 *
 * Featured is the right signal to read: `useFeaturedArticles` is the very query
 * `FeaturedSection` already runs, so this shares its cache entry and costs no
 * extra request. Reproducing the news-feed query's arg instead would risk
 * creating a second cache entry and a genuine duplicate fetch.
 */
export default function OnboardingAutoOpen() {
	const { open, hasSeen } = useOnboarding();
	const featuredArticles = useFeaturedArticles();
	const hasAutoOpened = useRef(false);

	const isContentReady = featuredArticles.length > 0;

	useEffect(() => {
		if (hasSeen || !isContentReady || hasAutoOpened.current) return;

		const timer = setTimeout(() => {
			// Set the guard INSIDE the callback, never at effect start. Under
			// StrictMode the effect runs, is cleaned up (clearing this timer),
			// then runs again — a guard set on entry would make that second pass
			// bail and the tour would never appear in dev, while working fine in
			// the production build. That asymmetry is miserable to debug.
			hasAutoOpened.current = true;
			open();
		}, AUTO_OPEN_DELAY_MS);

		return () => clearTimeout(timer);
	}, [hasSeen, isContentReady, open]);

	return null;
}
