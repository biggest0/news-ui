import { API_URL } from "@/config/config";

export async function submitEmailSubscriptionForm(email: string) {
	try {
		const response = await fetch(`${API_URL}/email-subscribe`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email }),
		});

		if (!response.ok) {
			throw new Error("Failed to connect to server. Please try again later.");
		}

		// if status is 200, need to check exists in data.message
		if (response.status === 200) {
			const data = await response.json();

			if (data.message.exists) {
				throw new Error("This email is already subscribed to our newsletter.");
			}
		}
	} catch (error) {
		// If it's already an Error we threw, rethrow it
		if (error instanceof Error) {
			throw error;
		}
		// Network or other errors
		throw new Error(
			"Unable to subscribe. Please check your connection."
		);
	}
}
