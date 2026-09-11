import { useTranslation } from "react-i18next";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import PageMeta from "@/components/common/seo/PageMeta";
import { SOCIAL_PROFILES } from "@/constants/site";

export default function Contact() {
	const { t } = useTranslation();

	return (
		<>
			<PageMeta title={t("SEO.CONTACT.TITLE")} description={t("SEO.CONTACT.DESCRIPTION")} />
			<section className="border-b border-border py-6">
				<SectionHeader title={t('PAGES.CONTACT.TITLE')} as="h1" />
				{/* Text body */}
				<div className="space-y-6 pt-4">
					{/* Catire Time */}
					<div className="text-center">
						<h3 className="text-lg text-foreground">{t('PAGES.CONTACT.EMAIL')}</h3>
						{/* href derives from the same key as the text, so the two
						    can't drift apart if the address ever changes */}
						<a
							href={`mailto:${t("PAGES.CONTACT.EMAIL_ADDRESS")}`}
							className="text-foreground-secondary hover:text-brand"
						>
							{t("PAGES.CONTACT.EMAIL_ADDRESS")}
						</a>
					</div>
					<div className="text-center flex flex-col">
						<h3 className="text-lg text-foreground">{t('PAGES.CONTACT.SOCIALS')}</h3>
						{/* One source for the profile URLs (constants/site.ts), shared with
						    the footer icons and the Organization markup */}
						{SOCIAL_PROFILES.map(({ id, label, handle, url }) => (
							<a
								key={id}
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-foreground-secondary hover:text-brand"
							>
								{`${label}: ${handle}` /* platform + handle — proper noun, untranslated */}
							</a>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
