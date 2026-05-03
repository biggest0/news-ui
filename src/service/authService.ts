import { postRegister, postLogin, postLogout, postRefreshToken, postGoogleExchange, postForgotPassword, postResetPassword, postVerifyEmail, postResendVerification } from "@/api/authApi";
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	RefreshResponse,
} from "@/types/authTypes";

/**
 * Registers a new user account.
 * On success the backend sets HttpOnly auth cookies directly — no token
 * is returned to the client. The returned user object is used to hydrate
 * the auth store.
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
			// "HTTP error" prefix comes from authApi when response.ok is false.
			// Any HTTP-level failure here is a server/network problem, not a
			// validation issue (the form validates inputs before calling this).
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			// Re-throw server-supplied messages (e.g. "Email already in use")
			// so they surface directly in the UI.
			throw error;
		}
		// Non-Error rejections (e.g. network offline before fetch resolves)
		throw new Error("Unable to register. Please check your connection.");
	}
}

/**
 * Logs in an existing user.
 * On success the backend sets HttpOnly auth cookies directly — no token
 * is returned to the client. The returned user object is used to hydrate
 * the auth store.
 * @param data - Email and password credentials
 * @returns User info on success (tokens are set as HttpOnly cookies)
 * @throws Error with a user-friendly message on failure
 */
export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
	try {
		return await postLogin(data);
	} catch (error) {
		if (error instanceof Error) {
			// 401 means the credentials were rejected — show a credential error,
			// not a connection error. Must be checked before the generic "HTTP error"
			// branch below, since a 401 also satisfies that condition.
			if (error.message.includes("401")) {
				throw new Error("Invalid email or password.");
			}
			// Any other HTTP failure (5xx, network timeout, etc.) is a server problem.
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			// Re-throw server-supplied messages (e.g. "Account not verified")
			throw error;
		}
		// Non-Error rejections (e.g. network offline before fetch resolves)
		throw new Error("Unable to log in. Please check your connection.");
	}
}

/**
 * Exchanges a refresh token cookie for new auth cookies.
 * Called on app load (AuthContext) to silently restore a session without
 * requiring the user to log in again. If the refresh token has expired or
 * is absent the call will fail and the session is cleared by the caller.
 * @returns User info from the refreshed session
 * @throws Error if the refresh token is expired or invalid
 */
export async function refreshAccessToken(): Promise<RefreshResponse> {
	// No error wrapping here — the caller (AuthContext) handles the failure
	// by calling authStore.clearSession() and treating it as a logged-out state.
	return await postRefreshToken();
}

/**
 * Exchanges the one-time Google loginCode for auth cookies.
 * After the Google OAuth redirect, the backend callback route issues a
 * short-lived UUID (loginCode) instead of exposing tokens in the URL.
 * This function trades that code for the real HttpOnly auth cookies.
 * @param loginCode - UUID from the /auth/google/callback redirect query param
 * @returns User info on success (tokens are set as HttpOnly cookies)
 * @throws Error with a user-facing message on failure
 */
export async function exchangeGoogleLoginCode(loginCode: string): Promise<AuthResponse> {
	// Error handling is done upstream in the Google callback page.
	return await postGoogleExchange(loginCode);
}

/**
 * Requests a password reset email for the given address.
 * The backend always responds with 200 regardless of whether the email
 * exists — this prevents user enumeration. Any error here is therefore
 * a genuine server/network problem, not a "not found" case.
 * @param email - The user's email address
 * @throws Error with a user-friendly message on failure
 */
export async function requestPasswordReset(email: string): Promise<void> {
	try {
		await postForgotPassword(email);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			throw error;
		}
		throw new Error("Something went wrong. Please try again.");
	}
}

/**
 * Resets the user's password using a valid reset token.
 * The token comes from the URL of the reset-password email link and is
 * single-use with a server-side expiry. A 4xx here typically means the
 * token has expired or already been used — the server message is surfaced
 * directly so the UI can prompt the user to request a new link.
 * @param token - The reset token from the email link
 * @param newPassword - The new password to set
 * @throws Error with a user-friendly message on failure
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
	try {
		await postResetPassword(token, newPassword);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			// Re-throw server messages (e.g. "Reset token has expired")
			throw error;
		}
		throw new Error("Something went wrong. Please try again.");
	}
}

/**
 * Verifies the user's email using the token from the verification email link.
 * Called by the email-verification page after the user clicks the link in
 * their inbox. Like reset tokens, verification tokens are single-use and
 * expire server-side.
 * @param token - The verification token from the URL
 * @throws Error with a user-friendly message on failure
 */
export async function verifyEmail(token: string): Promise<void> {
	try {
		await postVerifyEmail(token);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			// Re-throw server messages (e.g. "Verification token has expired")
			throw error;
		}
		throw new Error("Something went wrong. Please try again.");
	}
}

/**
 * Resends the verification email for the currently authenticated user.
 * Requires a valid session — the backend identifies the user from the
 * auth cookie, so no email address needs to be passed explicitly.
 * @throws Error with a user-friendly message on failure
 */
export async function resendVerification(): Promise<void> {
	try {
		await postResendVerification();
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			throw error;
		}
		throw new Error("Something went wrong. Please try again.");
	}
}

/**
 * Logs out the current user by invalidating cookies on the server.
 * The backend clears the HttpOnly auth and refresh cookies. The local
 * auth store is cleared by the caller (authStore.logout) regardless of
 * whether this call succeeds, so the user is always signed out client-side.
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
