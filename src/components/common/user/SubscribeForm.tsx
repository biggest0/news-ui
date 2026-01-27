import { useState } from "react";
import { useTranslation } from "react-i18next";

import { subscribeToNewsletter } from "@/service/formService";
import { validateEmail, cleanseEmail } from "@/utils/validation/textUtils";

export default function SubscribeForm() {
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const cleansedEmail = cleanseEmail(email);

		if (!validateEmail(cleansedEmail)) {
			setMessage(t("SUBSCRIBE.VALIDATION_ERROR"));
			return;
		}

		setIsSubmitting(true);
		setMessage("");

		try {
			await subscribeToNewsletter(cleansedEmail);
			setMessage(t("SUBSCRIBE.SUCCESS_MESSAGE"));
			setEmail("");
		} catch (error) {
			// Display the specific error message from the form service
			if (error instanceof Error) {
				setMessage(error.message);
			} else {
				setMessage(t("SUBSCRIBE.GENERIC_ERROR"));
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col space-y-2">
			<h4 className="text-lg font-semibold text-gray-800">
				{t("FOOTER.SUBSCRIBE_MESSAGE_TITLE")}
			</h4>
			<p className="text-sm text-gray-600">
				{t("FOOTER.SUBSCRIBE_MESSAGE")}
			</p>
			<form className="flex gap-2" onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder={t("FOOTER.SUBSCRIBE_INPUT_PLACEHOLDER")}
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
					{isSubmitting ? t("SUBSCRIBE.SUBSCRIBING") : t("FOOTER.SUBSCRIBE")}
				</button>
			</form>
			{message && (
				<p
					className={`text-sm ${message === t("SUBSCRIBE.SUCCESS_MESSAGE")
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
