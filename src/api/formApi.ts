import { API_URL } from "@/config/config";

export async function submitEmailSubscriptionForm(email: string) {
	fetch(`${API_URL}/email-subscribe`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});
	// for now, don't expect a repsonse, so no return/ no async because just writing email to db
	// will need to return a success so that the UI can show a success message and to check inbox for confirmation email
}
