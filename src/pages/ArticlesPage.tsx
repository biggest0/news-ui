import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CategoryNewsSection } from "@/components/news/section/newsSections/CategoryNewsSection";
import Breadcrumbs from "@/components/common/navigation/Breadcrumbs";
import PageMeta from "@/components/common/seo/PageMeta";
import { PAGE_ROUTES } from "@/constants/routes";
import type { CategoryKey } from "@/i18n/types";
import { breadcrumbJsonLd, type BreadcrumbItem } from "@/utils/seo/structuredData";

export default function ArticlesPage() {
	const { t } = useTranslation();
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];

	// Route slugs are lowercase; CATEGORY.* keys are uppercase
	const categoryName = t(
		`CATEGORY.${selectedCategory.toUpperCase()}` as `CATEGORY.${Uppercase<CategoryKey>}`
	);

	// Home / Category: rendered as a trail and as BreadcrumbList markup
	const crumbs: BreadcrumbItem[] = [
		{ name: t("NAVIGATION.HOME"), path: PAGE_ROUTES.HOME },
		{ name: categoryName, path: location.pathname },
	];

	return (
		<>
			<PageMeta
				title={t("SEO.CATEGORY.TITLE", { category: categoryName })}
				description={t("SEO.CATEGORY.DESCRIPTION", { category: categoryName })}
				jsonLd={breadcrumbJsonLd(crumbs)}
			/>
			<Breadcrumbs items={crumbs} className="pt-6 mb-0" />
			<CategoryNewsSection key={`${selectedCategory}-category-news-section`} />
		</>
	);
}
