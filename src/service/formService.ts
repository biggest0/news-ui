import { postEmailSubscription } from "@/api/formApi";

export async function subscribeToNewsletter(email: string): Promise<void> {
	try {
		const data = await postEmailSubscription(email);

		// Check if email already exists in the system
		if (data.message.exists) {
			throw new Error("This email is already subscribed to our newsletter.");
		}
	} catch (error) {
		// If it's already an Error we threw, rethrow it
		if (error instanceof Error) {
			// Handle HTTP errors with user-friendly messages
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			throw error;
		}
		// Network or other errors
		throw new Error("Unable to subscribe. Please check your connection.");
	}
}
