export interface AuthUser {
	id?: string;
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
	user: AuthUser;
}

export interface RefreshResponse {
	user: AuthUser;
}
