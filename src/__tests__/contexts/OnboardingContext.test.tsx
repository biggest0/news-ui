/**
 * Unit tests for OnboardingContext.
 *
 * The provider is intentionally dumb — open/close state plus the persisted
 * "already seen" record. Timing and route gating live in OnboardingAutoOpen
 * and are tested separately.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";

import {
	OnboardingProvider,
	useOnboarding,
} from "@/contexts/OnboardingContext";
import { ONBOARDING, ONBOARDING_VERSION } from "@/constants/keys";
import type { OnboardingState } from "@/types/localStorageTypes";

const wrapper = ({ children }: { children: ReactNode }) => (
	<OnboardingProvider>{children}</OnboardingProvider>
);

/** Reads the persisted record straight from localStorage. */
const storedState = (): OnboardingState =>
	JSON.parse(localStorage.getItem(ONBOARDING)!);

beforeEach(() => {
	localStorage.clear();
	vi.useRealTimers();
});

describe("OnboardingProvider", () => {
	it("starts closed", () => {
		const { result } = renderHook(() => useOnboarding(), { wrapper });
		expect(result.current.isOpen).toBe(false);
	});

	it("open() shows the tour without marking it seen", () => {
		const { result } = renderHook(() => useOnboarding(), { wrapper });

		act(() => result.current.open());

		expect(result.current.isOpen).toBe(true);
		expect(result.current.hasSeen).toBe(false);
		// nothing persisted yet — only closing records a dismissal
		expect(localStorage.getItem(ONBOARDING)).toBeNull();
	});

	it("close() hides the tour and persists the dismissal", () => {
		const { result } = renderHook(() => useOnboarding(), { wrapper });

		act(() => result.current.open());
		act(() => result.current.close("completed"));

		expect(result.current.isOpen).toBe(false);
		expect(result.current.hasSeen).toBe(true);
		expect(storedState().seenVersion).toBe(ONBOARDING_VERSION);
		expect(storedState().dismissedVia).toBe("completed");
		expect(storedState().completedAt).not.toBe("");
	});

	it("records how it was dismissed", () => {
		const { result } = renderHook(() => useOnboarding(), { wrapper });

		act(() => result.current.close("skipped"));
		expect(storedState().dismissedVia).toBe("skipped");
	});

	it("defaults dismissedVia to 'closed' when no reason is given", () => {
		const { result } = renderHook(() => useOnboarding(), { wrapper });

		act(() => result.current.close());
		expect(storedState().dismissedVia).toBe("closed");
	});
});

describe("OnboardingProvider — hasSeen from storage", () => {
	it("is false for a first-time visitor", () => {
		const { result } = renderHook(() => useOnboarding(), { wrapper });
		expect(result.current.hasSeen).toBe(false);
	});

	it("is true when the current version was already dismissed", () => {
		localStorage.setItem(
			ONBOARDING,
			JSON.stringify({
				seenVersion: ONBOARDING_VERSION,
				completedAt: "2026-01-01T00:00:00.000Z",
				dismissedVia: "completed",
			})
		);

		const { result } = renderHook(() => useOnboarding(), { wrapper });
		expect(result.current.hasSeen).toBe(true);
	});

	it("is false again after the version is bumped past what was dismissed", () => {
		// Simulates a returning visitor who dismissed an older tour: their
		// stored version is behind, so the tour is due to show once more.
		localStorage.setItem(
			ONBOARDING,
			JSON.stringify({
				seenVersion: ONBOARDING_VERSION - 1,
				completedAt: "2026-01-01T00:00:00.000Z",
				dismissedVia: "completed",
			})
		);

		const { result } = renderHook(() => useOnboarding(), { wrapper });
		expect(result.current.hasSeen).toBe(false);
	});
});

describe("useOnboarding", () => {
	it("throws when used outside the provider", () => {
		// React logs the error boundary trace; silence it for a clean run
		vi.spyOn(console, "error").mockImplementation(() => {});

		expect(() => renderHook(() => useOnboarding())).toThrow(
			/must be used within OnboardingProvider/
		);

		vi.restoreAllMocks();
	});
});
