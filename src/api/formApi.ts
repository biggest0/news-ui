import { API_URL } from "@/config/config";

interface EmailSubscriptionResponse {
	message: string;
	exists: boolean;
}

/**
 * Posts an email subscription request to the server.
 * POST /api/subscriptions
 * @param email - The email address to subscribe
 * @returns The response data from the server (flat `{ message, exists }`)
 * @throws Error if the HTTP request fails
 */
export async function postEmailSubscription(
	email: string
): Promise<EmailSubscriptionResponse> {
	const response = await fetch(`${API_URL}/api/subscriptions`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
}
