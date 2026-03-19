import { useTranslation } from "react-i18next";

import { SectionHeader } from "@/components/common/layout/SectionHeader";

export default function Contact() {
	const { t } = useTranslation();

	return (
		<>
			<section className="border-b border-border py-6">
				<SectionHeader title={t('PAGES.CONTACT.TITLE')}/>
				{/* Text body */}
				<div className="space-y-6 pt-4">
					{/* Catire Time */}
					<div className="text-center">
						<h3 className="text-lg text-primary">{t('PAGES.CONTACT.EMAIL')}</h3>
						<div className="text-secondary">catirecontact@gmail.com</div>
					</div>
					<div className="text-center flex flex-col">
						<h3 className="text-lg text-primary">{t('PAGES.CONTACT.SOCIALS')}</h3>
						<a
							href="https://www.instagram.com/catiretime"
							target="_blank"
							rel="noopener noreferrer"
							className="text-secondary hover:text-accent"
						>
							Instagram: catiretime
						</a>
						<a
							href="https://www.youtube.com/@catiretime"
							target="_blank"
							rel="noopener noreferrer"
							className="text-secondary hover:text-accent"
						>
							YouTube: catiretime
						</a>
						<a
							href="https://x.com/catiretime"
							target="_blank"
							rel="noopener noreferrer"
							className="text-secondary hover:text-accent"
						>
							X: catiretime
						</a>
					</div>
				</div>
			</section>
		</>
	);
}
