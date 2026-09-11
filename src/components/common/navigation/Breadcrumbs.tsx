import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/utils/seo/structuredData";

interface BreadcrumbsProps {
	/** Trail in order, home first. The last item is the current page and is not linked. */
	items: BreadcrumbItem[];
	/** Extra classes for the wrapping <nav>, e.g. page-specific spacing. */
	className?: string;
}

/**
 * Visible breadcrumb trail (Home / Category / Article).
 *
 * Pairs with `breadcrumbJsonLd()` from the same `items`: Google only honours
 * BreadcrumbList markup that reflects a trail the visitor can actually see,
 * so the page builds both from one array. Beyond the markup, the trail gives
 * every article a crawlable link back to its category page.
 */
export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
	const { t } = useTranslation();
	const lastIndex = items.length - 1;

	return (
		<nav aria-label={t("NAVIGATION.BREADCRUMB")} className={cn("text-sm text-muted-foreground mb-4", className)}>
			<ol className="flex flex-wrap items-center gap-x-2">
				{items.map((item, index) => (
					<li key={item.path} className="flex min-w-0 items-center gap-x-2">
						{index > 0 && <span aria-hidden="true">{"/"}</span>}
						{index === lastIndex ? (
							<span aria-current="page" className="truncate text-foreground-secondary">
								{item.name}
							</span>
						) : (
							<Link to={item.path} className="hover:text-brand transition-colors">
								{item.name}
							</Link>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
