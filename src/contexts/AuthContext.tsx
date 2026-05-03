import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

import type { AuthUser } from "@/types/authTypes";
import { authStore } from "@/auth/authStore";

/**
 * AuthProvider — bootstraps the session on mount by attempting a silent token
 * refresh via HttpOnly cookies. Auth state itself lives in the module-level
 * `authStore`, so this provider only needs to trigger the initial validation.
 *
 * Children can call `useAuth()` from anywhere; no Context.Provider is needed
 * because the store is module-level and shared across the app.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const bootstrappedRef = useRef(false);

	useEffect(() => {
		if (bootstrappedRef.current) return;
		bootstrappedRef.current = true;

		authStore
			.refresh()
			.then((success) => {
				if (!success) authStore.clearSession();
			})
			.finally(() => {
				authStore.setLoading(false);
			});
	}, []);

	return <>{children}</>;
};

interface AuthApi {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	loginWithGoogle: (loginCode: string) => Promise<void>;
}

/**
 * Subscribes to the auth store. Same shape as before so all existing callers
 * (and test mocks) keep working without changes.
 */
export const useAuth = (): AuthApi => {
	const state = useSyncExternalStore(authStore.subscribe, authStore.getState);
	return {
		user: state.user,
		isAuthenticated: state.isAuthenticated,
		isLoading: state.isLoading,
		login: authStore.login,
		register: authStore.register,
		logout: authStore.logout,
		loginWithGoogle: authStore.loginWithGoogle,
	};
};
