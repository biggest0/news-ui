import { API_URL } from "@/config/config";
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	RefreshResponse,
} from "@/types/authTypes";

/**
 * Picks the message to throw when register or login fails.
 *
 * The backend answers failures with `{ error }`, not `{ message }`. A 4xx
 * carries the actual reason ("Email already in use", a rate limit), so it is
 * passed through for authService to re-throw to the form. A 5xx body only says
 * "Unexpected Error", so it keeps the "HTTP error" form that authService turns
 * into its server-problem message, as does a body that isn't readable JSON.
 * @param status - HTTP status of the failed response
 * @param body - Parsed JSON body, or null when it couldn't be parsed
 * @returns The error message to throw
 */
function credentialErrorMessage(
	status: number,
	body: { error?: string } | null
): string {
	if (status < 500 && body?.error) return body.error;
	return `HTTP error! status: ${status}`;
}

/**
 * POST /auth/user/register
 * Creates a new user account. Tokens are set as HttpOnly cookies by the server.
 * @param data - Email and password for the new account
 * @returns The created user object
 * @throws Error with the server's reason on a 4xx, or a generic HTTP error
 */
export async function postRegister(
	data: RegisterRequest
): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/auth/user/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => null);
		throw new Error(credentialErrorMessage(response.status, error));
	}

	return await response.json();
}

/**
 * POST /auth/user/login
 * Authenticates an existing user. Tokens are set as HttpOnly cookies by the server.
 * @param data - Email and password credentials
 * @returns The authenticated user object
 * @throws Error with the server's reason on a 4xx, or a generic HTTP error
 */
export async function postLogin(data: LoginRequest): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/auth/user/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => null);
		throw new Error(credentialErrorMessage(response.status, error));
	}

	return await response.json();
}

/**
 * POST /auth/user/refresh
 * Rotates the refresh token cookie and issues new auth cookies.
 * Called silently on app load to restore a valid session.
 * @returns The current user info
 * @throws Error if the refresh token cookie is expired or the request fails
 */
export async function postRefreshToken(): Promise<RefreshResponse> {
	const response = await fetch(`${API_URL}/auth/user/refresh`, {
		method: "POST",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

/**
 * POST /auth/user/google/exchange
 * Exchanges the one-time loginCode (from the Google callback redirect) for
 * HttpOnly auth cookies.
 * @param loginCode - Short-lived UUID from the backend's redirect query param
 * @returns The authenticated user object
 * @throws Error with the server's error field, or a generic HTTP error
 */
export async function postGoogleExchange(loginCode: string): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/auth/user/google/exchange`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ loginCode }),
	});

	if (!response.ok) {
		const body = await response.json().catch(() => null);
		if (response.status === 429) {
			throw Object.assign(new Error("Too many attempts. Please wait a few minutes."), { status: 429 });
		}
		throw Object.assign(
			new Error(body?.error || "Google sign-in failed. Please try again."),
			{ status: response.status }
		);
	}

	return await response.json();
}

/**
 * POST /auth/user/logout
 * Invalidates the auth cookies on the server.
 * @throws Error if the request fails
 */
export async function postLogout(): Promise<void> {
	const response = await fetch(`${API_URL}/auth/user/logout`, {
		method: "POST",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}

/**
 * POST /auth/user/forgot-password
 * Requests a password reset email for the given address.
 * Always returns 200 to prevent user enumeration.
 * @param email - The user's email address
 * @returns The server's message
 * @throws Error if the request fails
 */
export async function postForgotPassword(email: string): Promise<{ message: string }> {
	const response = await fetch(`${API_URL}/auth/user/forgot-password`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => null);
		throw new Error(error?.error || `HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

/**
 * POST /auth/user/reset-password
 * Sets a new password using the reset token from the email link.
 * @param token - The reset token from the URL
 * @param newPassword - The new password to set
 * @returns The server's message
 * @throws Error with the server's error field on failure
 */
export async function postResetPassword(token: string, newPassword: string): Promise<{ message: string }> {
	const response = await fetch(`${API_URL}/auth/user/reset-password`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token, newPassword }),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => null);
		throw new Error(error?.error || `HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

/**
 * POST /auth/user/verify-email
 * Verifies the user's email using the token from the verification email link.
 * @param token - The verification token from the URL
 * @returns The server's message
 * @throws Error with the server's error field on failure
 */
export async function postVerifyEmail(token: string): Promise<{ message: string }> {
	const response = await fetch(`${API_URL}/auth/user/verify-email`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token }),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => null);
		throw new Error(error?.error || `HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

/**
 * POST /auth/user/resend-verification
 * Resends the verification email for the authenticated user.
 * Requires an active session (HttpOnly cookies).
 * @returns The server's message
 * @throws Error with the server's error field on failure
 */
export async function postResendVerification(): Promise<{ message: string }> {
	const response = await fetch(`${API_URL}/auth/user/resend-verification`, {
		method: "POST",
		credentials: "include",
	});

	if (!response.ok) {
		const error = await response.json().catch(() => null);
		throw new Error(error?.error || `HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

/**
 * GET /auth/user/me
 * Returns the current user info from the access token cookie.
 * @returns The current user object
 * @throws Error if not authenticated or the request fails
 */
export async function fetchCurrentUser(): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/auth/user/me`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
}
