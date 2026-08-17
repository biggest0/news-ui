import { useTranslation } from "react-i18next";

interface LoadingMessageProps {
	isLoading: boolean;
}

/**
 * Inline end-of-feed feedback for the article list. While a fetch is in flight
 * it shows a "more articles are coming" note; otherwise it tells the reader they
 * have reached the end. Both strings are localized.
 *
 * @param isLoading - whether a page/next-page request is currently in flight.
 */
export function LoadingMessage({ isLoading }: LoadingMessageProps) {
	const { t } = useTranslation();
	return (
		<div className="text-center text-muted-foreground py-4">
			{isLoading
				? t("PAGINATION.ARTICLES_COMING")
				: t("PAGINATION.CAUGHT_UP")}
		</div>
	);
}
