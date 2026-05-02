import type { AuthTokens, AuthUser } from "@/types/authTypes";
import { AUTH_TOKENS, AUTH_USER } from "@/constants/keys";
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
 * - React reads via `useAuth` (which subscribes through useSyncExternalStore).
 * - The API layer (authFetch) calls `refresh()` and `clearSession()` directly.
 * - Concurrent refreshes share one in-flight promise so token rotation can't
 *   race against itself.
 */

interface AuthState {
	user: AuthUser | null;
	tokens: AuthTokens | null;
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
	tokens: readJSON<AuthTokens>(AUTH_TOKENS),
	isLoading: true,
};

const subscribers = new Set<() => void>();

const setState = (patch: Partial<AuthState>) => {
	state = { ...state, ...patch };
	subscribers.forEach((fn) => fn());
};

const persistSession = (user: AuthUser, tokens: AuthTokens) => {
	localStorage.setItem(AUTH_TOKENS, JSON.stringify(tokens));
	localStorage.setItem(AUTH_USER, JSON.stringify(user));
	setState({ user, tokens });
};

const clearSessionInternal = () => {
	localStorage.removeItem(AUTH_TOKENS);
	localStorage.removeItem(AUTH_USER);
	setState({ user: null, tokens: null });
};

let inflightRefresh: Promise<string | null> | null = null;

const performRefresh = async (): Promise<string | null> => {
	const stored = readJSON<AuthTokens>(AUTH_TOKENS);
	if (!stored) return null;
	try {
		const result = await refreshAccessToken(stored.refreshToken);
		const updated: AuthTokens = {
			accessToken: result.accessToken,
			refreshToken: result.refreshToken ?? stored.refreshToken,
		};
		localStorage.setItem(AUTH_TOKENS, JSON.stringify(updated));
		setState({ tokens: updated });
		return updated.accessToken;
	} catch {
		return null;
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

	refresh(): Promise<string | null> {
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
		persistSession(response.user, {
			accessToken: response.accessToken,
			refreshToken: response.refreshToken,
		});
	},

	async register(email: string, password: string) {
		const response = await registerService({ email, password });
		persistSession(response.user, {
			accessToken: response.accessToken,
			refreshToken: response.refreshToken,
		});
	},

	async loginWithGoogle(loginCode: string) {
		const response = await exchangeGoogleLoginCode(loginCode);
		persistSession(response.user, {
			accessToken: response.accessToken,
			refreshToken: response.refreshToken,
		});
	},

	async logout() {
		const current = state.tokens;
		if (current) {
			try {
				await logoutService(current.accessToken, current.refreshToken);
			} catch {
				// Logout failed on server — clear locally anyway
			}
		}
		clearSessionInternal();
	},
};
