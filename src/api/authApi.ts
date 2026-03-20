import { API_URL } from "@/config/config";
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	RefreshResponse,
} from "@/types/authTypes";

/**
 * POST /auth/user/register
 * Creates a new user account.
 * @param data - Email and password for the new account
 * @returns Auth tokens and the created user object
 * @throws Error with the server's message, or a generic HTTP error
 */
export async function postRegister(
	data: RegisterRequest
): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/auth/user/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => null);
		throw new Error(
			error?.message || `HTTP error! status: ${response.status}`
		);
	}

	return await response.json();
}

/**
 * POST /auth/user/login
 * Authenticates an existing user.
 * @param data - Email and password credentials
 * @returns Auth tokens and the authenticated user object
 * @throws Error with the server's message, or a generic HTTP error
 */
export async function postLogin(data: LoginRequest): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/auth/user/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => null);
		throw new Error(
			error?.message || `HTTP error! status: ${response.status}`
		);
	}

	return await response.json();
}

/**
 * POST /auth/user/refresh
 * Exchanges a refresh token for a new access token.
 * Called silently on app load to restore a valid session.
 * @param refreshToken - The stored refresh token
 * @returns A new access token
 * @throws Error if the token is expired or the request fails
 */
export async function postRefreshToken(
	refreshToken: string
): Promise<RefreshResponse> {
	const response = await fetch(`${API_URL}/auth/user/refresh`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refreshToken }),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

/**
 * POST /auth/user/logout
 * Invalidates the user's tokens on the server.
 * Requires a valid access token in the Authorization header.
 * @param accessToken - Sent as Bearer token in the Authorization header
 * @param refreshToken - The refresh token to invalidate server-side
 * @throws Error if the request fails
 */
export async function postLogout(
	accessToken: string,
	refreshToken: string
): Promise<void> {
	const response = await fetch(`${API_URL}/auth/user/logout`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ refreshToken }),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}
