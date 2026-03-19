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
			<h4 className="text-lg font-semibold text-primary">
				{t("FOOTER.SUBSCRIBE_MESSAGE_TITLE")}
			</h4>
			<p className="text-sm text-secondary">
				{t("FOOTER.SUBSCRIBE_MESSAGE")}
			</p>
			<form className="flex gap-2" onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder={t("FOOTER.SUBSCRIBE_INPUT_PLACEHOLDER")}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isSubmitting}
					className="border border-disabled rounded-lg px-4 py-2 w-full
						bg-elevated
						text-primary dark:text-slate-100
						placeholder:text-gray-400 dark:placeholder:text-slate-500
						focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400
						disabled:bg-hover-bg
						transition-colors duration-200"
				/>
				<button
					type="submit"
					disabled={!validateEmail(email) || isSubmitting}
					className="bg-accent-bg text-white px-4 py-2 rounded-lg
						hover:bg-amber-700 dark:hover:bg-amber-500
						transition-colors duration-200
						disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
				>
					{isSubmitting ? t("SUBSCRIBE.SUBSCRIBING") : t("FOOTER.SUBSCRIBE")}
				</button>
			</form>
			{message && (
				<p
					className={`text-sm ${message === t("SUBSCRIBE.SUCCESS_MESSAGE")
						? "text-green-600 dark:text-green-400"
						: message.includes("already subscribed")
							? "text-yellow-600 dark:text-yellow-400"
							: "text-red-600 dark:text-red-400"
						}`}
				>
					{message}
				</p>
			)}
		</div>
	);
}
