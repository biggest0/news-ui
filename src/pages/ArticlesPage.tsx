import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CategoryNewsSection } from "@/components/news/section/newsSections/CategoryNewsSection";
import PageMeta from "@/components/common/seo/PageMeta";
import type { CategoryKey } from "@/i18n/types";

export default function ArticlesPage() {
	const { t } = useTranslation();
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];

	// Route slugs are lowercase; CATEGORY.* keys are uppercase
	const categoryName = t(
		`CATEGORY.${selectedCategory.toUpperCase()}` as `CATEGORY.${Uppercase<CategoryKey>}`
	);

	return (
		<>
			<PageMeta
				title={t("SEO.CATEGORY.TITLE", { category: categoryName })}
				description={t("SEO.CATEGORY.DESCRIPTION", { category: categoryName })}
			/>
			<CategoryNewsSection key={`${selectedCategory}-category-news-section`} />
		</>
	);
}
