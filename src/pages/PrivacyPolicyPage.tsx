import { useTranslation } from "react-i18next";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import PageMeta from "@/components/common/seo/PageMeta";

/**
 * Privacy policy (audit B3 — an AdSense requirement, and owed to readers
 * regardless since the site holds accounts and reading histories).
 *
 * Deliberately structured with real <h2>/<p> elements rather than the stacked
 * <div>s the other static pages use: a legal document is the one place where
 * document structure genuinely matters, for screen readers and for anyone
 * linking to a specific section.
 *
 * Left-aligned rather than centred like DisclaimerPage — long-form prose is
 * materially harder to read centred.
 */
export default function PrivacyPolicyPage() {
	const { t } = useTranslation();

	/** Section heading + its paragraphs, in document order. */
	const sections = [
		{ title: t("PAGES.PRIVACY.WHO_TITLE"), body: [t("PAGES.PRIVACY.WHO_BODY")] },
		{
			title: t("PAGES.PRIVACY.COLLECT_TITLE"),
			body: [
				t("PAGES.PRIVACY.COLLECT_ACCOUNT"),
				t("PAGES.PRIVACY.COLLECT_ACTIVITY"),
				t("PAGES.PRIVACY.COLLECT_NEWSLETTER"),
				t("PAGES.PRIVACY.COLLECT_VIEWS"),
			],
		},
		{
			title: t("PAGES.PRIVACY.DEVICE_TITLE"),
			body: [t("PAGES.PRIVACY.DEVICE_BODY")],
		},
		{
			title: t("PAGES.PRIVACY.COOKIES_TITLE"),
			body: [t("PAGES.PRIVACY.COOKIES_AUTH"), t("PAGES.PRIVACY.COOKIES_ADS")],
		},
		{
			title: t("PAGES.PRIVACY.SHARING_TITLE"),
			body: [
				t("PAGES.PRIVACY.SHARING_NO_SELL"),
				t("PAGES.PRIVACY.SHARING_PROVIDERS"),
			],
		},
		{
			title: t("PAGES.PRIVACY.RETENTION_TITLE"),
			body: [t("PAGES.PRIVACY.RETENTION_BODY")],
		},
		{
			title: t("PAGES.PRIVACY.CHOICES_TITLE"),
			body: [
				t("PAGES.PRIVACY.CHOICES_HISTORY"),
				t("PAGES.PRIVACY.CHOICES_REQUESTS"),
			],
		},
		{
			title: t("PAGES.PRIVACY.CHILDREN_TITLE"),
			body: [t("PAGES.PRIVACY.CHILDREN_BODY")],
		},
		{
			title: t("PAGES.PRIVACY.CHANGES_TITLE"),
			body: [t("PAGES.PRIVACY.CHANGES_BODY")],
		},
	];

	return (
		<section className="border-b border-border py-6">
			<PageMeta
				title={t("SEO.PRIVACY.TITLE")}
				description={t("SEO.PRIVACY.DESCRIPTION")}
			/>
			<SectionHeader title={t("PAGES.PRIVACY.TITLE")} as="h1" />

			<div className="max-w-3xl space-y-8 pt-4">
				<p className="text-sm text-muted-foreground">
					{t("PAGES.PRIVACY.UPDATED")}
				</p>

				{sections.map((section) => (
					<div key={section.title} className="space-y-3">
						<h2 className="text-lg text-foreground">{section.title}</h2>
						{section.body.map((paragraph, index) => (
							<p
								key={`${section.title}-${index}`}
								className="text-foreground-secondary leading-relaxed"
							>
								{paragraph}
							</p>
						))}
					</div>
				))}
			</div>
		</section>
	);
}
