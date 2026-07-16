import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { resetPassword } from "@/service/authService";

export default function NewPasswordPage() {
	const { t } = useTranslation();
	const { token } = useParams<{ token: string }>();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!password.trim() || !confirmPassword.trim()) {
			setError(t("AUTH.VALIDATION_ERROR"));
			return;
		}

		if (password !== confirmPassword) {
			setError(t("AUTH.PASSWORDS_MISMATCH"));
			return;
		}

		setIsSubmitting(true);

		try {
			await resetPassword(token!, password);
			setSuccess(true);
		} catch (err) {
			if (err instanceof Error) {
				if (err.message === "Invalid or expired reset token") {
					setError(t("AUTH.RESET_TOKEN_INVALID"));
				} else {
					setError(err.message);
				}
			} else {
				setError(t("SUBSCRIBE.GENERIC_ERROR"));
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="py-6">
			<SectionHeader title={t("AUTH.NEW_PASSWORD_TITLE")} />

			<div className="max-w-sm pt-6">
				{success ? (
					<div className="flex flex-col gap-4">
						<p className="text-foreground-secondary">{t("AUTH.RESET_SUCCESS")}</p>
						<Link
							to="/login"
							className="bg-primary text-white py-2 rounded-lg hover:bg-primary-hover transition-colors text-center"
						>
							{t("AUTH.RESET_GO_TO_LOGIN")}
						</Link>
					</div>
				) : (
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<label htmlFor="password" className="block text-sm text-muted-foreground mb-1">
								{t("AUTH.NEW_PASSWORD")}
							</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isSubmitting}
								className="w-full border-b border-border-subtle bg-transparent py-2 text-foreground-secondary outline-none placeholder:text-muted-foreground focus:border-brand transition-colors"
								placeholder={t("AUTH.NEW_PASSWORD")}
							/>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm text-muted-foreground mb-1">
								{t("AUTH.CONFIRM_NEW_PASSWORD")}
							</label>
							<input
								type="password"
								id="confirmPassword"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								disabled={isSubmitting}
								className="w-full border-b border-border-subtle bg-transparent py-2 text-foreground-secondary outline-none placeholder:text-muted-foreground focus:border-brand transition-colors"
								placeholder={t("AUTH.CONFIRM_NEW_PASSWORD")}
							/>
						</div>

						{error && <p className="text-sm text-destructive">{error}</p>}

						<button
							type="submit"
							disabled={isSubmitting}
							className="bg-primary text-white py-2 rounded-lg hover:bg-primary-hover transition-colors disabled:bg-disabled-bg disabled:cursor-not-allowed"
						>
							{isSubmitting ? t("AUTH.RESETTING_PASSWORD") : t("AUTH.RESET_PASSWORD")}
						</button>

						<p className="mt-2 text-sm text-muted-foreground">
							<Link
								to="/login"
								className="text-brand hover:underline transition-colors"
							>
								{t("AUTH.BACK_TO_LOGIN")}
							</Link>
						</p>
					</form>
				)}
			</div>
		</section>
	);
}
