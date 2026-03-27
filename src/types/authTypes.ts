export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface AuthUser {
	email: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: AuthUser;
}

export interface RefreshResponse {
	accessToken: string;
	refreshToken: string;
}
