/**
 * Unit tests for OnboardingAutoOpen — the headless first-visit trigger.
 *
 * Route gating is deliberately NOT tested: it's structural, since only
 * HomePage mounts this component. What matters here is the version gate, the
 * content-readiness gate (which keeps the dialog off the full-screen loading
 * overlay), and timer cleanup.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, act } from "@testing-library/react";
import { StrictMode } from "react";

import OnboardingAutoOpen from "@/components/onboarding/OnboardingAutoOpen";

const AUTO_OPEN_DELAY_MS = 600;

const open = vi.fn();
let hasSeen = false;
let featuredArticles: unknown[] = [];

vi.mock("@/contexts/OnboardingContext", () => ({
	useOnboarding: () => ({ isOpen: false, open, close: vi.fn(), hasSeen }),
}));

vi.mock("@/hooks/useArticleHooks", () => ({
	useFeaturedArticles: () => featuredArticles,
}));

/** Advances past the settle delay inside act() so effects flush. */
const runSettleDelay = () =>
	act(() => {
		vi.advanceTimersByTime(AUTO_OPEN_DELAY_MS);
	});

beforeEach(() => {
	vi.clearAllMocks();
	vi.useFakeTimers();
	hasSeen = false;
	featuredArticles = [{ id: "a-1" }];
});

afterEach(() => {
	vi.useRealTimers();
});

describe("OnboardingAutoOpen", () => {
	it("renders nothing", () => {
		const { container } = render(<OnboardingAutoOpen />);
		expect(container).toBeEmptyDOMElement();
	});

	it("opens the tour once content has arrived and the delay elapses", () => {
		render(<OnboardingAutoOpen />);

		expect(open).not.toHaveBeenCalled(); // not immediately
		runSettleDelay();

		expect(open).toHaveBeenCalledTimes(1);
	});

	it("stays shut while featured articles are still loading", () => {
		// The home feed shows a full-screen opaque overlay during initial load;
		// opening here would paint the dialog on top of a loading screen.
		featuredArticles = [];
		render(<OnboardingAutoOpen />);

		runSettleDelay();

		expect(open).not.toHaveBeenCalled();
	});

	it("opens once content arrives after an initially empty load", () => {
		featuredArticles = [];
		const { rerender } = render(<OnboardingAutoOpen />);
		runSettleDelay();
		expect(open).not.toHaveBeenCalled();

		featuredArticles = [{ id: "a-1" }];
		rerender(<OnboardingAutoOpen />);
		runSettleDelay();

		expect(open).toHaveBeenCalledTimes(1);
	});

	it("stays shut for a visitor who already dismissed this version", () => {
		hasSeen = true;
		render(<OnboardingAutoOpen />);

		runSettleDelay();

		expect(open).not.toHaveBeenCalled();
	});

	it("opens for a returning visitor once the version is bumped", () => {
		// hasSeen is derived from seenVersion < ONBOARDING_VERSION in the
		// provider; a bump flips it back to false, which is this case.
		hasSeen = false;
		render(<OnboardingAutoOpen />);

		runSettleDelay();

		expect(open).toHaveBeenCalledTimes(1);
	});

	it("does not open after unmounting mid-delay", () => {
		const { unmount } = render(<OnboardingAutoOpen />);

		unmount();
		act(() => {
			vi.advanceTimersByTime(AUTO_OPEN_DELAY_MS);
		});

		expect(open).not.toHaveBeenCalled();
	});

	it("still opens under StrictMode's double-invoked effects", () => {
		// main.tsx renders the app inside <StrictMode>, so in development the
		// effect runs, is cleaned up (clearing the timer), then runs again. This
		// is the regression guard for the "already opened" ref: if it were set at
		// effect start instead of inside the timeout, the second pass would bail
		// and the tour would never appear in dev — while passing in production.
		render(
			<StrictMode>
				<OnboardingAutoOpen />
			</StrictMode>
		);

		runSettleDelay();

		expect(open).toHaveBeenCalledTimes(1);
	});

	it("opens only once even if the effect re-runs", () => {
		const { rerender } = render(<OnboardingAutoOpen />);
		runSettleDelay();
		expect(open).toHaveBeenCalledTimes(1);

		// a re-render with new featured data must not re-trigger the tour
		featuredArticles = [{ id: "a-1" }, { id: "a-2" }];
		rerender(<OnboardingAutoOpen />);
		runSettleDelay();

		expect(open).toHaveBeenCalledTimes(1);
	});
});
