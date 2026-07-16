import { useTranslation } from "react-i18next";

import Image from "@/assets/maintenance_hero_image.jpg";

/** Placeholder page state for routes still under construction. */
export const UnderMaintenance = () => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center text-center pt-4">
			<img
				src={Image}
				alt={t("PAGES.MAINTENANCE.IMAGE_ALT")}
				className="w-full max-w-128 h-full object-contain mb-6"
			/>
			<h2 className="text-xl md:text-3xl font-bold text-foreground">
				{t("PAGES.MAINTENANCE.TITLE")}
			</h2>
			<p className="mt-2">{t("PAGES.MAINTENANCE.BODY")}</p>
		</div>
	);
};
