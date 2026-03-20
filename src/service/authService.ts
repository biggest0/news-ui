import { postRegister, postLogin, postLogout, postRefreshToken } from "@/api/authApi";
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	RefreshResponse,
} from "@/types/authTypes";

/**
 * Registers a new user account.
 * @param data - Email and password for the new account
 * @returns Auth tokens and user info on success
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
 * @returns Auth tokens and user info on success
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
 * Exchanges a refresh token for a new access token.
 * Used on app load to silently restore a session.
 * @param refreshToken - The stored refresh token
 * @returns A new access token
 * @throws Error if the refresh token is expired or invalid
 */
export async function refreshAccessToken(
	refreshToken: string
): Promise<RefreshResponse> {
	return await postRefreshToken(refreshToken);
}

/**
 * Logs out the current user by invalidating tokens on the server.
 * @param accessToken - The current access token (sent as Bearer header)
 * @param refreshToken - The refresh token to invalidate
 * @throws Error with a user-friendly message on failure
 */
export async function logoutUser(
	accessToken: string,
	refreshToken: string
): Promise<void> {
	try {
		await postLogout(accessToken, refreshToken);
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
