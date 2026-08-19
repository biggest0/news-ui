import { Link } from "react-router-dom";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { useTranslation } from "react-i18next";

import OnboardingLauncher from "@/components/onboarding/OnboardingLauncher";
import PageMeta from "@/components/common/seo/PageMeta";

export default function About() {
	const { t } = useTranslation();

	return (
		<>
			<PageMeta title={t("SEO.ABOUT.TITLE")} description={t("SEO.ABOUT.DESCRIPTION")} />
			<section className="border-b border-border py-6">
				<SectionHeader title={t("PAGES.ABOUT.TITLE")} as="h1" />
				{/* Text body */}
				<div className="space-y-6 pt-4">
					{/* Catire Time */}
					<div className="text-center">
						<h3 className="text-lg text-foreground">{t("APP.TITLE")}</h3>
						<p className="text-foreground-secondary">
							{t("PAGES.ABOUT.INTRODUCTION")}
						</p>
					</div>
					{/* Our mission */}
					<div className="text-center">
						<h3 className="text-lg text-foreground">{t("PAGES.ABOUT.MISSION_TITLE")}</h3>
						<p className="text-foreground-secondary">
							{t("PAGES.ABOUT.MISSION_CONTENT")}
						</p>
					</div>
					<div className="text-center">
						<h3 className="text-lg text-foreground">{t("PAGES.ABOUT.FUN_READS_TITLE")}</h3>
						<p className="text-foreground-secondary">
							{t("PAGES.ABOUT.FUN_READS_CONTENT")}
						</p>
					</div>
					{/* Disclaimer */}
					<div className="text-center">
						<h3 className="text-lg text-foreground">{t("PAGES.ABOUT.DISCLAIMER_TITLE")}</h3>
						<p className="text-foreground-secondary">
							{t("PAGES.ABOUT.DISCLAIMER_CONTENT")}
						</p>
						<Link
							className="cursor-pointer text-muted-foreground hover:text-foreground underline"
							to="/disclaimer"
						>
							{t("PAGES.ABOUT.FULL_DISCLAIMER")}
						</Link>
					</div>
					{/* Re-run the onboarding tour — the only entry point on desktop */}
					<div className="text-center">
						<h3 className="text-lg text-foreground">
							{t("PAGES.ABOUT.GETTING_STARTED_TITLE")}
						</h3>
						<p className="text-foreground-secondary">
							{t("PAGES.ABOUT.GETTING_STARTED_CONTENT")}
						</p>
						<OnboardingLauncher />
					</div>
				</div>
			</section>
		</>
	);
}
