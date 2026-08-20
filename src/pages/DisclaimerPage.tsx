import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useTranslation } from "react-i18next";
import PageMeta from "@/components/common/seo/PageMeta";

export default function DisclaimerPage() {
	const { t } = useTranslation();

	return (
		<>
			<PageMeta title={t("SEO.DISCLAIMER.TITLE")} description={t("SEO.DISCLAIMER.DESCRIPTION")} />
			<section className="border-b border-border py-6">
				<SectionHeader title={t("PAGES.DISCLAIMER.TITLE")} as="h1" />
				{/* Text body */}
				<div className="space-y-6 pt-4 text-center flex flex-col text-foreground-secondary">
					<p>
						{t("PAGES.DISCLAIMER.CONTENT_1")}
					</p>
					<p>
						{t("PAGES.DISCLAIMER.CONTENT_2")}
					</p>
					<p>
						{t("PAGES.DISCLAIMER.CONTENT_3")}
					</p>
					<p>
						{t("PAGES.DISCLAIMER.CONTENT_4")}
					</p>
					<p>
						{t("PAGES.DISCLAIMER.CONTENT_5")}
					</p>
					<p>
						{t("PAGES.DISCLAIMER.CONTENT_6")}
					</p>
				</div>
			</section>
		</>
	);
}
