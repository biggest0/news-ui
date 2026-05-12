import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { verifyEmail, resendVerification } from "@/service/authService";

export default function EmailVerificationPage() {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const [status, setStatus] = useState<"verifying" | "success" | "error">(
		token ? "verifying" : "error"
	);
	const [error, setError] = useState("");
	const [countdown, setCountdown] = useState(0);
	const [resendSuccess, setResendSuccess] = useState(false);
	const [resendError, setResendError] = useState("");
	const attemptedRef = useRef(false);

	// Runs once when the component mounts and calls the verifyEmail
	useEffect(() => {
		// Guard: no token or already attempted
		if (!token || attemptedRef.current) return;
		attemptedRef.current = true;

		verifyEmail(token)
			.then(() => setStatus("success"))
			.catch((err) => {
				setStatus("error");
				setError(
					err instanceof Error ? err.message : t("AUTH.VERIFY_FAILED")
				);
			});
	}, [token, t]);

	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
		return () => clearTimeout(timer);
	}, [countdown]);

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

	if (status === "verifying") {
		return (
			<section className="py-6">
				<SectionHeader title={t("AUTH.VERIFY_EMAIL_TITLE")} />
				<div className="max-w-md pt-6">
					<p className="text-secondary">{t("AUTH.VERIFY_VERIFYING")}</p>
				</div>
			</section>
		);
	}

	if (status === "success") {
		return (
			<section className="py-6">
				<SectionHeader title={t("AUTH.VERIFY_SUCCESS_TITLE")} />
				<div className="max-w-md pt-6 flex flex-col gap-4">
					<p className="text-secondary">{t("AUTH.VERIFY_SUCCESS")}</p>
					<Link
						to="/account"
						className="bg-accent-bg text-white py-2 rounded-lg hover:bg-accent-bg-hover transition-colors text-center"
					>
						{t("AUTH.VERIFY_GO_TO_ACCOUNT")}
					</Link>
				</div>
			</section>
		);
	}

	return (
		<section className="py-6">
			<SectionHeader title={t("AUTH.VERIFY_EMAIL_TITLE")} />
			<div className="max-w-md pt-6 flex flex-col gap-4">
				<p className="text-error">
					{error || t("AUTH.VERIFY_FAILED")}
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

				<Link
					to="/login"
					className="text-accent hover:underline transition-colors text-sm"
				>
					{t("AUTH.BACK_TO_LOGIN")}
				</Link>
			</div>
		</section>
	);
}
