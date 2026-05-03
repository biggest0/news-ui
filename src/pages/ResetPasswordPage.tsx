import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { requestPasswordReset } from "@/service/authService";

export default function ResetPasswordPage() {
	const { t } = useTranslation();

	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [sent, setSent] = useState(false);
	const [countdown, setCountdown] = useState(0);

	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
		return () => clearTimeout(timer);
	}, [countdown]);

	const sendResetEmail = async () => {
		setError("");
		setIsSubmitting(true);
		try {
			await requestPasswordReset(email);
			setSent(true);
			setCountdown(30);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError(t("SUBSCRIBE.GENERIC_ERROR"));
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) {
			setError(t("AUTH.VALIDATION_ERROR"));
			return;
		}
		await sendResetEmail();
	};

	return (
		<section className="py-6">
			<SectionHeader title={t("AUTH.RESET_PASSWORD_TITLE")} />

			<div className="max-w-md pt-6">
				{sent ? (
					<div className="flex flex-col gap-4">
						<h2 className="text-lg font-semibold text-primary">{t("AUTH.RESET_EMAIL_SENT_HEADING")}</h2>
						<p className="text-secondary">{t("AUTH.RESET_EMAIL_SENT_BODY")}</p>
						<button
							type="button"
							onClick={sendResetEmail}
							disabled={countdown > 0}
							className="bg-accent-bg text-white py-2 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-500 transition-colors disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
						>
							{countdown > 0
								? t("AUTH.RESEND_IN", { seconds: countdown })
								: t("AUTH.RESEND_RESET_LINK")}
						</button>
						<Link
							to="/login"
							className="text-accent hover:underline transition-colors text-sm"
						>
							{t("AUTH.BACK_TO_LOGIN")}
						</Link>
					</div>
				) : (
					<>
						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<div>
								<label
									htmlFor="email"
									className="block text-sm text-muted mb-1"
								>
									{t("AUTH.EMAIL")}
								</label>
								<input
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isSubmitting}
									className="w-full border-b border-border-subtle bg-transparent py-2 text-secondary outline-none placeholder:text-muted focus:border-accent transition-colors"
									placeholder={t("AUTH.EMAIL")}
								/>
							</div>

							{error && (
								<p className="text-sm text-red-600 dark:text-red-400">
									{error}
								</p>
							)}
							<p className="text-secondary text-sm">
								{t("AUTH.RESET_PASSWORD_SUBTITLE")}
							</p>
							<button
								type="submit"
								disabled={isSubmitting}
								className="bg-accent-bg text-white py-2 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-500 transition-colors disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
							>
								{isSubmitting
									? t("AUTH.SENDING_RESET_LINK")
									: t("AUTH.SEND_RESET_LINK")}
							</button>
						</form>

						<p className="mt-6 text-sm text-muted">
							<Link
								to="/login"
								className="text-accent hover:underline transition-colors"
							>
								{t("AUTH.BACK_TO_LOGIN")}
							</Link>
						</p>
					</>
				)}
			</div>
		</section>
	);
}
