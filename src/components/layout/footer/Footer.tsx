import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SubscribeForm from "@/components/common/user/SubscribeForm";
import SocialMediaLinks from "@/components/common/social/SocialMediaLinks";

export default function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="w-full max-w-[1280px] mx-auto bg-white border-t border-gray-200 mt-6">
			{/* Top Section */}
			<div className="px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center md:justify-items-start">
				{/* Left side - Logo, caption, social */}
				<div className="flex flex-col items-center md:items-start space-y-4">
					<div className="text-2xl font-bold text-gray-800">
						{t("APP.TITLE")}
					</div>
					<div className="text-sm text-gray-600">
						{t("FOOTER.BRAND_TAGLINE")}
					</div>
					<SocialMediaLinks />
				</div>

				{/* Right side - Mailing list */}
				<SubscribeForm />
			</div>

			{/* Bottom section */}
			<div className="text-center py-6 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap justify-center gap-6">
				<span>{t("FOOTER.COPYRIGHT")}</span>
				<Link className="cursor-pointer hover:text-black" to="/disclaimer">
					{t("FOOTER.DISCLAIMER")}
				</Link>
				<Link className="cursor-pointer hover:text-black" to="/about">
					{t("FOOTER.ABOUT_US")}
				</Link>
				<Link className="cursor-pointer hover:text-black" to="/contact">
					{t("FOOTER.CONTACT")}
				</Link>
			</div>
		</footer>
	);
}
