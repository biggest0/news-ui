import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PageMeta from "@/components/common/seo/PageMeta";
import { buttonVariants } from "@/components/ui/Button";

/**
 * 404 page for genuinely unmatched routes.
 *
 * The HTTP status is already correct without any work here: GitHub Pages
 * serves `404.html` with a real 404 for unknown paths, and that shell boots
 * the app, which lands on this route. Client-side navigation to a bad link
 * never touches the server and renders this too.
 *
 * Note this does *not* catch `/article/<id>`: those match a real route, so a
 * direct hit renders the article normally despite the server's 404 status.
 */
export default function NotFoundPage() {
	const { t } = useTranslation();

	return (
		<section className="flex flex-col items-center gap-4 py-16 text-center">
			<PageMeta
				title={t("SEO.NOT_FOUND.TITLE")}
				description={t("SEO.NOT_FOUND.DESCRIPTION")}
			/>

			<p className="font-heading text-6xl text-brand">
				{"404" /* numeral — the same in both languages */}
			</p>

			<h1 className="font-heading text-2xl text-foreground">
				{t("PAGES.NOT_FOUND.TITLE")}
			</h1>

			<p className="max-w-md text-foreground-secondary">
				{t("PAGES.NOT_FOUND.MESSAGE")}
			</p>

			<div className="flex flex-wrap justify-center gap-3 pt-2">
				<Link to="/" className={buttonVariants({ variant: "default", size: "sm" })}>
					{t("PAGES.NOT_FOUND.HOME")}
				</Link>
				<Link
					to="/search"
					className={buttonVariants({ variant: "outline", size: "sm" })}
				>
					{t("PAGES.NOT_FOUND.SEARCH")}
				</Link>
			</div>
		</section>
	);
}
