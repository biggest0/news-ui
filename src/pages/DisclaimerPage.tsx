import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useTranslation } from "node_modules/react-i18next";

export default function DisclaimerPage() {
	const { t } = useTranslation();

	return (
		<>
			<section className="border-b border-gray-400 py-6">
				<SectionHeader title={t("PAGES.DISCLAIMER.TITLE")} />
				{/* Text body */}
				<div className="space-y-6 pt-4 text-center flex flex-col">
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
