import { useState } from "react";
import { subscribeToNewsletter } from "@/service/formService";
import { validateEmail, cleanseEmail } from "@/utils/textUtils";

export default function SubscribeButton() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const cleansedEmail = cleanseEmail(email);

		if (!validateEmail(cleansedEmail)) {
			setMessage("Please enter a valid email address.");
			return;
		}

		setIsSubmitting(true);
		setMessage("");

		try {
			await subscribeToNewsletter(cleansedEmail);
			setMessage("Thank you for subscribing! Check your inbox to confirm.");
			setEmail("");
		} catch (error) {
			// Display the specific error message from the form service
			if (error instanceof Error) {
				setMessage(error.message);
			} else {
				setMessage("Something went wrong. Please try again.");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col space-y-2">
			<h4 className="text-lg font-semibold text-gray-800">
				Subscribe to our newsletter
			</h4>
			<p className="text-sm text-gray-600">
				Get the latest news delivered to your inbox.
			</p>
			<form className="flex gap-2" onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isSubmitting}
					className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
				/>
				<button
					type="submit"
					disabled={!validateEmail(email) || isSubmitting}
					className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{isSubmitting ? "Subscribing..." : "Subscribe"}
				</button>
			</form>
			{message && (
				<p
					className={`text-sm ${
						message.includes("Thank you") ||
						message.includes("Check your inbox")
							? "text-green-600"
							: message.includes("already subscribed")
							? "text-yellow-600"
							: "text-red-600"
					}`}
				>
					{message}
				</p>
			)}
		</div>
	);
}
