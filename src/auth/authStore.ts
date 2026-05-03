import type { AuthUser } from "@/types/authTypes";
import { AUTH_USER } from "@/constants/keys";
import {
	registerUser as registerService,
	loginUser as loginService,
	logoutUser as logoutService,
	refreshAccessToken,
	exchangeGoogleLoginCode,
} from "@/service/authService";

/**
 * Module-level auth store. Single source of truth for the user's session.
 *
 * Tokens are managed entirely via HttpOnly cookies — the frontend only
 * tracks the user object (for UI rendering) and an authenticated flag.
 *
 * - React reads via `useAuth` (which subscribes through useSyncExternalStore).
 * - The API layer (authFetch) calls `refresh()` and `clearSession()` directly.
 * - Concurrent refreshes share one in-flight promise so token rotation can't
 *   race against itself.
 */

interface AuthState {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

const readJSON = <T,>(key: string): T | null => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : null;
	} catch {
		return null;
	}
};

let state: AuthState = {
	user: readJSON<AuthUser>(AUTH_USER),
	isAuthenticated: !!readJSON<AuthUser>(AUTH_USER),
	isLoading: true,
};

const subscribers = new Set<() => void>();

const setState = (patch: Partial<AuthState>) => {
	state = { ...state, ...patch };
	subscribers.forEach((fn) => fn());
};

const persistUser = (user: AuthUser) => {
	localStorage.setItem(AUTH_USER, JSON.stringify(user));
	setState({ user, isAuthenticated: true });
};

const clearSessionInternal = () => {
	localStorage.removeItem(AUTH_USER);
	setState({ user: null, isAuthenticated: false });
};

let inflightRefresh: Promise<boolean> | null = null;

const performRefresh = async (): Promise<boolean> => {
	try {
		const result = await refreshAccessToken();
		persistUser(result.user);
		return true;
	} catch {
		return false;
	}
};

export const authStore = {
	getState: (): AuthState => state,

	subscribe(listener: () => void): () => void {
		subscribers.add(listener);
		return () => {
			subscribers.delete(listener);
		};
	},

	refresh(): Promise<boolean> {
		if (!inflightRefresh) {
			inflightRefresh = performRefresh().finally(() => {
				inflightRefresh = null;
			});
		}
		return inflightRefresh;
	},

	setLoading(isLoading: boolean) {
		setState({ isLoading });
	},

	clearSession() {
		clearSessionInternal();
	},

	async login(email: string, password: string) {
		const response = await loginService({ email, password });
		persistUser(response.user);
	},

	async register(email: string, password: string) {
		const response = await registerService({ email, password });
		persistUser(response.user);
	},

	async loginWithGoogle(loginCode: string) {
		const response = await exchangeGoogleLoginCode(loginCode);
		persistUser(response.user);
	},

	async logout() {
		try {
			await logoutService();
		} catch {
			// Logout failed on server — clear locally anyway
		}
		clearSessionInternal();
	},
};
