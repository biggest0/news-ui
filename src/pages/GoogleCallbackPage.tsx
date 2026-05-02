import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

export default function GoogleCallbackPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { loginWithGoogle } = useAuth();

	const [error, setError] = useState("");
	const handledRef = useRef(false);

	useEffect(() => {
		// Guard against StrictMode double-invoke
		if (handledRef.current) return;
		handledRef.current = true;

		const handleCallback = async () => {
			const params = new URLSearchParams(window.location.search);
			const googleError = params.get("error");
			const isCancelled = params.get("cancelled") === "true";
			const loginCode = params.get("loginCode");
			const returnedState = params.get("state");

			// Step A — Google-side error
			if (googleError) {
				if (isCancelled || googleError === "access_denied") {
					navigate("/login", { replace: true });
					return;
				}
				setError(t("AUTH.GOOGLE_FAILED"));
				navigate("/login", { replace: true });
				return;
			}

			// Step B — Cross-Site Request Forgery (CSRF) state validation
			const savedState = sessionStorage.getItem("google_oauth_state");
			sessionStorage.removeItem("google_oauth_state");

			if (!savedState || savedState !== returnedState) {
				setError(t("AUTH.GOOGLE_STATE_INVALID"));
				navigate("/login", { replace: true, state: { googleError: t("AUTH.GOOGLE_STATE_INVALID") } });
				return;
			}

			// Step C — exchange loginCode for tokens
			if (!loginCode) {
				navigate("/login", { replace: true, state: { googleError: t("AUTH.GOOGLE_FAILED") } });
				return;
			}

			try {
				await loginWithGoogle(loginCode);
				navigate("/account", { replace: true });
			} catch (err) {
				const message = err instanceof Error ? err.message : t("AUTH.GOOGLE_FAILED");
				navigate("/login", { replace: true, state: { googleError: message } });
			}
		};

		handleCallback();
	}, [navigate, loginWithGoogle, t]);

	return (
		<section className="py-6 flex items-center justify-center min-h-40">
			{error ? (
				<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
			) : (
				<p className="text-sm text-muted">{t("AUTH.GOOGLE_SIGNING_IN")}</p>
			)}
		</section>
	);
}
