import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	type ReactNode,
} from "react";
import type { AuthTokens, AuthUser } from "@/types/authTypes";
import { AUTH_TOKENS, AUTH_USER } from "@/constants/keys";
import {
	registerUser as registerService,
	loginUser as loginService,
	logoutUser as logoutService,
	refreshAccessToken,
} from "@/service/authService";

/**
 * AuthContext provides authentication state and actions to the entire app.
 *
 * State:
 * - `user`            — The authenticated user (email), or null if logged out
 * - `isAuthenticated` — True when both user and tokens are present
 * - `isLoading`       — True while the session is being validated on mount
 *
 * Actions:
 * - `login`    — Calls the login endpoint, stores tokens, sets user state
 * - `register` — Calls the register endpoint, stores tokens, sets user state
 * - `logout`   — Invalidates tokens on the server and clears local state
 *
 * Session validation:
 * On mount, AuthProvider attempts a silent token refresh. If the refresh token
 * is valid, the access token is renewed and the session is restored. If it
 * fails (expired or invalid), the user is logged out.
 *
 * Storage:
 * Tokens and user info are persisted in localStorage under AUTH_TOKENS and
 * AUTH_USER keys so the session survives page reloads.
 */
interface AuthContextType {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Reads auth tokens from localStorage. Returns null if missing or malformed. */
const getStoredTokens = (): AuthTokens | null => {
	try {
		const raw = localStorage.getItem(AUTH_TOKENS);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
};

/** Reads user info from localStorage. Returns null if missing or malformed. */
const getStoredUser = (): AuthUser | null => {
	try {
		const raw = localStorage.getItem(AUTH_USER);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
};

/** Persists tokens and user info to localStorage after login or register. */
const storeAuth = (tokens: AuthTokens, user: AuthUser) => {
	localStorage.setItem(AUTH_TOKENS, JSON.stringify(tokens));
	localStorage.setItem(AUTH_USER, JSON.stringify(user));
};

/** Removes auth tokens and user info from localStorage on logout or session expiry. */
const clearAuth = () => {
	localStorage.removeItem(AUTH_TOKENS);
	localStorage.removeItem(AUTH_USER);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
	const [tokens, setTokens] = useState<AuthTokens | null>(
		() => getStoredTokens()
	);
	const [isLoading, setIsLoading] = useState(true);

	const isAuthenticated = !!user && !!tokens;

	// Try to refresh token on mount to validate session
	useEffect(() => {
		const validateSession = async () => {
			const storedTokens = getStoredTokens();
			if (!storedTokens) {
				setIsLoading(false);
				return;
			}

			try {
				const { accessToken } = await refreshAccessToken(
					storedTokens.refreshToken
				);
				const updatedTokens = { ...storedTokens, accessToken };
				setTokens(updatedTokens);
				localStorage.setItem(AUTH_TOKENS, JSON.stringify(updatedTokens));
			} catch {
				// Refresh failed — session expired
				clearAuth();
				setUser(null);
				setTokens(null);
			} finally {
				setIsLoading(false);
			}
		};

		validateSession();
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		const response = await loginService({ email, password });
		const newTokens: AuthTokens = {
			accessToken: response.accessToken,
			refreshToken: response.refreshToken,
		};
		storeAuth(newTokens, response.user);
		setTokens(newTokens);
		setUser(response.user);
	}, []);

	const register = useCallback(async (email: string, password: string) => {
		const response = await registerService({ email, password });
		const newTokens: AuthTokens = {
			accessToken: response.accessToken,
			refreshToken: response.refreshToken,
		};
		storeAuth(newTokens, response.user);
		setTokens(newTokens);
		setUser(response.user);
	}, []);

	const logout = useCallback(async () => {
		if (tokens) {
			try {
				await logoutService(tokens.accessToken, tokens.refreshToken);
			} catch {
				// Logout failed on server — still clear locally
			}
		}
		clearAuth();
		setUser(null);
		setTokens(null);
	}, [tokens]);

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, isLoading, login, register, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

/**
 * Hook to access authentication state and actions.
 * Must be used inside AuthProvider.
 */
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};
