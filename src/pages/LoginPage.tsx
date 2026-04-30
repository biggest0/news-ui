import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";

function buildGoogleLoginUrl(): string {
	const state = crypto.randomUUID();
	sessionStorage.setItem("google_oauth_state", state);

	const params = new URLSearchParams({
		client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
		redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
		response_type: "code",
		scope: "openid email profile",
		access_type: "online",
		prompt: "select_account",
		state,
	});

	return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export default function LoginPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();

	const googleError = (location.state as { googleError?: string } | null)?.googleError;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(googleError ?? "");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email.trim() || !password.trim()) {
			setError(t("AUTH.VALIDATION_ERROR"));
			return;
		}

		setIsSubmitting(true);

		try {
			await login(email, password);
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
			<SectionHeader title={t("AUTH.LOGIN_TITLE")} />

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

					{error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-accent-bg text-white py-2 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-500 transition-colors disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
					>
						{isSubmitting ? t("AUTH.LOGGING_IN") : t("AUTH.LOGIN")}
					</button>
				</form>

				<div className="flex items-center gap-3 my-2">
					<hr className="flex-1 border-border-subtle" />
					<span className="text-xs text-muted">{t("AUTH.OR")}</span>
					<hr className="flex-1 border-border-subtle" />
				</div>

				<button
					type="button"
					onClick={() => { window.location.href = buildGoogleLoginUrl(); }}
					className="w-full flex items-center justify-center gap-2 border border-border-subtle rounded-lg py-2 text-sm text-secondary hover:bg-hover-bg transition-colors"
				>
					<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
						<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
						<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
						<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
						<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
						<path fill="none" d="M0 0h48v48H0z"/>
					</svg>
					{t("AUTH.SIGN_IN_GOOGLE")}
				</button>

				<p className="mt-6 text-sm text-muted">
					{t("AUTH.NO_ACCOUNT")}{" "}
					<Link
						to="/register"
						className="text-accent hover:underline transition-colors"
					>
						{t("AUTH.REGISTER")}
					</Link>
				</p>
			</div>
		</section>
	);
}
