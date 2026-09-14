import { useTranslation } from "react-i18next";

import { buttonVariants } from "@/components/ui/Button";

/**
 * What `RouteErrorBoundary` shows when a route cannot render. Split out as its
 * own component so the boundary (which must be a class) can still use hooks for
 * translation.
 */
export function RouteErrorFallback() {
	const { t } = useTranslation();

	return (
		<section className="flex flex-col items-center gap-4 py-16 text-center">
			<p className="text-foreground-secondary">{t("COMMON.PAGE_ERROR")}</p>
			<button
				type="button"
				onClick={() => window.location.reload()}
				className={buttonVariants({ variant: "default", size: "sm" })}
			>
				{t("COMMON.RELOAD")}
			</button>
		</section>
	);
}
