import { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";
import { resendVerification } from "@/service/authService";

export default function RegisterPage() {
	const { t } = useTranslation();
	const { register } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [registered, setRegistered] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [resendError, setResendError] = useState("");
	const [resendSuccess, setResendSuccess] = useState(false);

	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
		return () => clearTimeout(timer);
	}, [countdown]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
			setError(t("AUTH.VALIDATION_ERROR"));
			return;
		}

		if (password !== confirmPassword) {
			setError(t("AUTH.PASSWORDS_MISMATCH"));
			return;
		}

		setIsSubmitting(true);

		try {
			await register(email, password);
			setRegistered(true);
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

	const handleResend = async () => {
		setResendError("");
		setResendSuccess(false);
		try {
			await resendVerification();
			setResendSuccess(true);
			setCountdown(30);
		} catch {
			setResendError(t("AUTH.VERIFY_RESEND_FAILED"));
		}
	};

	if (registered) {
		return (
			<section className="py-6">
				<SectionHeader title={t("AUTH.VERIFY_EMAIL_TITLE")} />

				<div className="max-w-sm pt-6 flex flex-col gap-4">
					<h2 className="text-lg font-semibold text-primary">
						{t("AUTH.VERIFY_EMAIL_HEADING")}
					</h2>
					<p className="text-secondary">
						<Trans
							i18nKey="AUTH.VERIFY_EMAIL_BODY"
							values={{ email }}
							components={{ strong: <strong /> }}
						/>
					</p>

					{resendSuccess && (
						<p className="text-sm text-success">
							{t("AUTH.VERIFY_RESEND_SUCCESS")}
						</p>
					)}
					{resendError && (
						<p className="text-sm text-error">
							{resendError}
						</p>
					)}

					<button
						type="button"
						onClick={handleResend}
						disabled={countdown > 0}
						className="bg-accent-bg text-white py-2 rounded-lg hover:bg-accent-bg-hover transition-colors disabled:bg-disabled-bg disabled:cursor-not-allowed"
					>
						{countdown > 0
							? t("AUTH.VERIFY_RESEND_IN", { seconds: countdown })
							: t("AUTH.VERIFY_RESEND")}
					</button>
				</div>
			</section>
		);
	}

	return (
		<section className="py-6">
			<SectionHeader title={t("AUTH.REGISTER_TITLE")} />

			<div className="max-w-sm pt-6">
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email" className="block text-sm text-muted mb-1">
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

					<div>
						<label
							htmlFor="password"
							className="block text-sm text-muted mb-1"
						>
							{t("AUTH.PASSWORD")}
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isSubmitting}
							className="w-full border-b border-border-subtle bg-transparent py-2 text-secondary outline-none placeholder:text-muted focus:border-accent transition-colors"
							placeholder={t("AUTH.PASSWORD")}
						/>
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm text-muted mb-1"
						>
							{t("AUTH.CONFIRM_PASSWORD")}
						</label>
						<input
							type="password"
							id="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							disabled={isSubmitting}
							className="w-full border-b border-border-subtle bg-transparent py-2 text-secondary outline-none placeholder:text-muted focus:border-accent transition-colors"
							placeholder={t("AUTH.CONFIRM_PASSWORD")}
						/>
					</div>

					{error && <p className="text-sm text-error">{error}</p>}

					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-accent-bg text-white py-2 rounded-lg hover:bg-accent-bg-hover transition-colors disabled:bg-disabled-bg disabled:cursor-not-allowed"
					>
						{isSubmitting ? t("AUTH.REGISTERING") : t("AUTH.REGISTER")}
					</button>
				</form>

				<p className="mt-6 text-sm text-muted">
					{t("AUTH.HAS_ACCOUNT")}{" "}
					<Link
						to="/login"
						className="text-accent hover:underline transition-colors"
					>
						{t("AUTH.LOGIN")}
					</Link>
				</p>
			</div>
		</section>
	);
}
