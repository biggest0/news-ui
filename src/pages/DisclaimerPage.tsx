import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useTranslation } from "react-i18next";
import PageMeta from "@/components/common/seo/PageMeta";

export default function DisclaimerPage() {
	const { t } = useTranslation();

	return (
		<>
			<PageMeta title={t("SEO.DISCLAIMER.TITLE")} description={t("SEO.DISCLAIMER.DESCRIPTION")} />
			<section className="border-b border-border py-6">
				<SectionHeader title={t("PAGES.DISCLAIMER.TITLE")} />
				{/* Text body */}
				<div className="space-y-6 pt-4 text-center flex flex-col text-foreground-secondary">
					<div>
						{t("PAGES.DISCLAIMER.CONTENT_1")}
					</div>
					<div>
						{t("PAGES.DISCLAIMER.CONTENT_2")}
					</div>
					<div>
						{t("PAGES.DISCLAIMER.CONTENT_3")}
					</div>
					<div>
						{t("PAGES.DISCLAIMER.CONTENT_4")}
					</div>
					<div>
						{t("PAGES.DISCLAIMER.CONTENT_5")}
					</div>
					<div>
						{t("PAGES.DISCLAIMER.CONTENT_6")}
					</div>
				</div>
			</section>
		</>
	);
}
