import { API_URL } from "@/config/config";

interface EmailSubscriptionResponse {
	message: {
		exists: boolean;
	};
}

/**
 * Posts an email subscription request to the server
 * @param email - The email address to subscribe
 * @returns The response data from the server
 * @throws Error if the HTTP request fails
 */
export async function postEmailSubscription(
	email: string
): Promise<EmailSubscriptionResponse> {
	const response = await fetch(`${API_URL}/email-subscribe`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
}
