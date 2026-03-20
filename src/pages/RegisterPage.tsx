import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { register } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

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
			navigate("/account");
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

	return (
		<section className="py-6">
			<SectionHeader title={t("AUTH.REGISTER_TITLE")} />

			<div className="max-w-md pt-6">
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
							// placeholder={t("AUTH.EMAIL")}
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
							// placeholder={t("AUTH.PASSWORD")}
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
							// placeholder={t("AUTH.CONFIRM_PASSWORD")}
						/>
					</div>

					{error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-accent-bg text-white py-2 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-500 transition-colors disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
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
