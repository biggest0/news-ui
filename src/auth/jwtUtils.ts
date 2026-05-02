/**
 * Reads the `exp` claim from a JWT and returns the expiration time in ms.
 * Does NOT verify the signature — that's the backend's job. We only need
 * the expiry to decide whether to refresh proactively.
 */
export function getTokenExpiry(token: string | null): number | null {
	if (!token) return null;
	const parts = token.split(".");
	if (parts.length !== 3) return null;
	try {
		const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
		const claims = JSON.parse(atob(padded));
		return typeof claims.exp === "number" ? claims.exp * 1000 : null;
	} catch {
		return null;
	}
}

/**
 * True if the token is expired or expires within `bufferMs`.
 * Buffer accounts for in-flight latency and minor clock skew so we don't
 * send a request with a token that will expire mid-request.
 *
 * Returns false for tokens we can't decode (no `exp` claim, opaque token,
 * etc.) — let the server be the source of truth in that case.
 */
export function isTokenExpired(token: string | null, bufferMs = 30_000): boolean {
	const expiry = getTokenExpiry(token);
	if (expiry === null) return false;
	return Date.now() + bufferMs >= expiry;
}
