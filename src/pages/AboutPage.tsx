import { Link } from "react-router-dom";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useTranslation } from "react-i18next";

export default function About() {
	const { t } = useTranslation();

	return (
		<>
			<section className="border-b border-border py-6">
				<SectionHeader title={t("PAGES.ABOUT.TITLE")} />
				{/* Text body */}
				<div className="space-y-6 pt-4">
					{/* Catire Time */}
					<div className="text-center">
						<h3 className="text-lg text-primary">{t("APP.TITLE")}</h3>
						<div className="text-secondary">
							{t("PAGES.ABOUT.INTRODUCTION")}
						</div>
					</div>
					{/* Our mission */}
					<div className="text-center">
						<h3 className="text-lg text-primary">{t("PAGES.ABOUT.MISSION_TITLE")}</h3>
						<div className="text-secondary">
							{t("PAGES.ABOUT.MISSION_CONTENT")}
						</div>
					</div>
					<div className="text-center">
						<h3 className="text-lg text-primary">{t("PAGES.ABOUT.FUN_READS_TITLE")}</h3>
						<div className="text-secondary">
							{t("PAGES.ABOUT.FUN_READS_CONTENT")}
						</div>
					</div>
					{/* Disclaimer */}
					<div className="text-center">
						<h3 className="text-lg text-primary">{t("PAGES.ABOUT.DISCLAIMER_TITLE")}</h3>
						<div className="text-secondary">
							{t("PAGES.ABOUT.DISCLAIMER_CONTENT")}
						</div>
						<Link
							className="cursor-pointer text-muted hover:text-primary underline"
							to="/disclaimer"
						>
							{t("PAGES.ABOUT.FULL_DISCLAIMER")}
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
