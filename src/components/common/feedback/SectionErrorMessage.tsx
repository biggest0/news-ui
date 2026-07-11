import { useTranslation } from "react-i18next";

interface SectionErrorMessageProps {
	/** Refetch callback from the failed RTK Query hook. */
	onRetry: () => void;
}

/**
 * Inline load-failure message for sections/lists (M5 error-UX decision):
 * replaces the old silent-empty behavior with a small localized notice and a
 * retry action, styled to sit quietly inside the newspaper layout.
 */
export function SectionErrorMessage({ onRetry }: SectionErrorMessageProps) {
	const { t } = useTranslation();

	return (
		<div className="py-4 text-sm text-muted-foreground">
			{t("COMMON.LOAD_ERROR")}{" "}
			<button
				type="button"
				onClick={onRetry}
				className="cursor-pointer underline hover:text-brand transition-colors duration-200"
			>
				{t("COMMON.RETRY")}
			</button>
		</div>
	);
}
