import { postRegister, postLogin, postLogout, postRefreshToken, postGoogleExchange } from "@/api/authApi";
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	RefreshResponse,
} from "@/types/authTypes";

/**
 * Registers a new user account.
 * @param data - Email and password for the new account
 * @returns User info on success (tokens are set as HttpOnly cookies)
 * @throws Error with a user-friendly message on failure
 */
export async function registerUser(
	data: RegisterRequest
): Promise<AuthResponse> {
	try {
		return await postRegister(data);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			throw error;
		}
		throw new Error("Unable to register. Please check your connection.");
	}
}

/**
 * Logs in an existing user.
 * @param data - Email and password credentials
 * @returns User info on success (tokens are set as HttpOnly cookies)
 * @throws Error with a user-friendly message on failure
 */
export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
	try {
		return await postLogin(data);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			throw error;
		}
		throw new Error("Unable to log in. Please check your connection.");
	}
}

/**
 * Exchanges a refresh token cookie for new auth cookies.
 * Used on app load to silently restore a session.
 * @returns User info from the refreshed session
 * @throws Error if the refresh token is expired or invalid
 */
export async function refreshAccessToken(): Promise<RefreshResponse> {
	return await postRefreshToken();
}

/**
 * Exchanges the one-time Google loginCode for auth cookies.
 * @param loginCode - UUID from the /auth/google/callback redirect query param
 * @returns User info on success (tokens are set as HttpOnly cookies)
 * @throws Error with a user-facing message on failure
 */
export async function exchangeGoogleLoginCode(loginCode: string): Promise<AuthResponse> {
	return await postGoogleExchange(loginCode);
}

/**
 * Logs out the current user by invalidating cookies on the server.
 * @throws Error with a user-friendly message on failure
 */
export async function logoutUser(): Promise<void> {
	try {
		await postLogout();
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			throw error;
		}
		throw new Error("Unable to log out. Please check your connection.");
	}
}
