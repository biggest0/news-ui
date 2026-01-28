import { useTranslation } from "react-i18next";

import FeaturedSection from "@/components/news/section/FeaturedSection";
import BackToTopButton from "@/components/common/navigation/BackToTopButton";
import { HomeNewsSection } from "@/components/news/section/newsSections/HomeNewsSection";
import PopularSection from "@/components/news/section/PopularSection";
import MobileEditorsSection from "@/components/news/section/mobileSections/MobileEditorsSection";
import MobileCatFactsSection from "@/components/news/section/mobileSections/MobileCatFactsSection";
import { useAllSectionNotVisible } from "@/hooks/useSectionCollapse";
import { useAppSettings } from "@/contexts/AppSettingContext";
import EmptyStateSection from "@/components/news/section/EmptyStateSection";
import MobileStaffPicksSection from "@/components/news/section/mobileSections/MobileStaffPicksSection";

export default function HomePage() {
	const { t } = useTranslation();
	const isAllSectionNotVisible = useAllSectionNotVisible();
	const { resetSectionVisibility } = useAppSettings();
	return (
		<>
			<FeaturedSection />
			<MobileStaffPicksSection />
			<PopularSection />
			<MobileEditorsSection />
			<MobileCatFactsSection />
			<HomeNewsSection key={"home-article-section"} />
			{/* section to reset sections */}
			<EmptyStateSection
				isVisible={isAllSectionNotVisible}
				resetSectionVisibility={resetSectionVisibility}
				message={t("EMPTY_STATE.ALL_SECTIONS_MESSAGE")}
				buttonText={t("EMPTY_STATE.RESET_TO_DEFAULT")}
			/>
			<BackToTopButton />
		</>
	);
}
