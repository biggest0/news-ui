import { useTranslation } from "react-i18next";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import PageMeta from "@/components/common/seo/PageMeta";

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
						<a
							href="https://www.instagram.com/catiretime"
							target="_blank"
							rel="noopener noreferrer"
							className="text-foreground-secondary hover:text-brand"
						>
							{"Instagram: catiretime" /* platform + handle — proper noun, untranslated */}
						</a>
						<a
							href="https://www.youtube.com/@catiretime"
							target="_blank"
							rel="noopener noreferrer"
							className="text-foreground-secondary hover:text-brand"
						>
							{"YouTube: catiretime" /* platform + handle — proper noun, untranslated */}
						</a>
						<a
							href="https://x.com/catiretime"
							target="_blank"
							rel="noopener noreferrer"
							className="text-foreground-secondary hover:text-brand"
						>
							{"X: catiretime" /* platform + handle — proper noun, untranslated */}
						</a>
					</div>
				</div>
			</section>
		</>
	);
}
