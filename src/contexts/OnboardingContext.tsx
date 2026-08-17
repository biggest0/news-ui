import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";

import { ONBOARDING_VERSION } from "@/constants/keys";
import type { OnboardingDismissal } from "@/types/localStorageTypes";
import {
	getOnboardingState,
	setOnboardingState,
} from "@/utils/storage/localStorageUtils";

interface OnboardingContextType {
	/** Whether the tour dialog is currently showing. */
	isOpen: boolean;
	/** Opens the tour. Does not mark it seen — only closing does that. */
	open: () => void;
	/** Closes the tour and records the dismissal so it stops auto-opening. */
	close: (via?: OnboardingDismissal) => void;
	/** True once the user has dismissed the current tour version. */
	hasSeen: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
	undefined
);

/**
 * Holds the onboarding tour's open state and its "already seen" record.
 *
 * Deliberately free of routing and timing logic: deciding *when* a first-time
 * visitor should see the tour belongs to `<OnboardingAutoOpen />`, which
 * HomePage mounts. This provider only answers "is it open?" and "has it been
 * dismissed?", so the mobile menu and About page can open it from anywhere in
 * the tree while the dialog itself stays mounted once at App level.
 */
export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	// Read once on mount — the stored record only changes through close() below,
	// so there is nothing to re-read on every render.
	const [hasSeen, setHasSeen] = useState(
		() => getOnboardingState().seenVersion >= ONBOARDING_VERSION
	);

	const open = useCallback(() => setIsOpen(true), []);

	/**
	 * Closes the tour and persists the dismissal.
	 * @param via - How it was closed; recorded for insight, not behaviour.
	 */
	const close = useCallback((via: OnboardingDismissal = "closed") => {
		setIsOpen(false);
		setHasSeen(true);
		setOnboardingState({
			seenVersion: ONBOARDING_VERSION,
			completedAt: new Date().toISOString(),
			dismissedVia: via,
		});
	}, []);

	const value = useMemo(
		() => ({ isOpen, open, close, hasSeen }),
		[isOpen, open, close, hasSeen]
	);

	return (
		<OnboardingContext.Provider value={value}>
			{children}
		</OnboardingContext.Provider>
	);
};

/**
 * Access the onboarding tour's state and controls. Must be called inside
 * OnboardingProvider — throws if used outside the tree.
 */
export const useOnboarding = () => {
	const context = useContext(OnboardingContext);
	if (!context) {
		throw new Error("useOnboarding must be used within OnboardingProvider");
	}
	return context;
};
