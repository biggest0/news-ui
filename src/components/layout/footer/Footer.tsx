import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SubscribeForm from "@/components/common/user/SubscribeForm";
import SocialMediaLinks from "@/components/common/social/SocialMediaLinks";

export default function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="w-full max-w-[1280px] mx-auto bg-surface border-t border-border-subtle mt-6 transition-colors duration-200">
			{/* Top Section */}
			<div className="px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center md:justify-items-start">
				{/* Left side - Logo, caption, social */}
				<div className="flex flex-col items-center md:items-start space-y-4">
					<div className="text-2xl font-bold text-primary">
						{t("APP.TITLE")}
					</div>
					<div className="text-sm text-secondary">
						{t("FOOTER.BRAND_TAGLINE")}
					</div>
					<SocialMediaLinks />
				</div>

				{/* Right side - Mailing list */}
				<SubscribeForm />
			</div>

			{/* Bottom section — copyright stays on its own line on narrow screens, links wrap below */}
			<div className="py-6 border-t border-border-subtle text-sm text-muted flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
				<span className="shrink-0">{t("FOOTER.COPYRIGHT")}</span>
				<div className="flex flex-wrap justify-center gap-6">
					<Link className="cursor-pointer hover:text-primary transition-colors" to="/disclaimer">
						{t("FOOTER.DISCLAIMER")}
					</Link>
					<Link className="cursor-pointer hover:text-primary transition-colors" to="/about">
						{t("FOOTER.ABOUT_US")}
					</Link>
					<Link className="cursor-pointer hover:text-primary transition-colors" to="/contact">
						{t("FOOTER.CONTACT")}
					</Link>
					<Link className="cursor-pointer hover:text-primary transition-colors" to="/blog">
						{t("FOOTER.BLOG")}
					</Link>
				</div>
			</div>
		</footer>
	);
}
