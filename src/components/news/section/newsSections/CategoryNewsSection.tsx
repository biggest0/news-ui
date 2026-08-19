import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { BaseNewsSection } from "@/components/news/section/newsSections/BaseNewsSection";
import type { CategoryKey } from "@/i18n/types";

/**
 * Category feed — the category comes from the route and keys its own RTK
 * Query cache entry (no more shared store array + client-side re-filtering).
 *
 * Passes the category's own name down as the heading: previously all eight
 * category routes rendered a page headed "MEWS", which made them
 * indistinguishable to readers and to search engines alike (audit M1). The
 * feed is the whole page here, so its heading is the page's `h1` (M3).
 */
export function CategoryNewsSection() {
	const { t } = useTranslation();
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];

	// Route slugs are lowercase; the CATEGORY.* keys are uppercase
	const categoryName = t(
		`CATEGORY.${selectedCategory.toUpperCase()}` as `CATEGORY.${Uppercase<CategoryKey>}`
	);

	return (
		<BaseNewsSection
			category={selectedCategory}
			headingTitle={categoryName}
			// without ={...} automatically filled to ={true}
			isPageHeading
		/>
	);
}
