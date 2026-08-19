import { useTranslation } from "react-i18next";

import FeaturedSection from "@/components/news/section/FeaturedSection";
import BackToTopButton from "@/components/common/navigation/BackToTopButton";
import { HomeNewsSection } from "@/components/news/section/newsSections/HomeNewsSection";
import PopularSection from "@/components/news/section/PopularSection";
import RecommendedSection from "@/components/news/section/RecommendedSection";
import EditorsSection from "@/components/news/section/EditorsSection";
import CatFactsSection from "@/components/news/section/CatFactsSection";
import { useAllSectionNotVisible } from "@/hooks/useSectionCollapse";
import { useAppSettings } from "@/contexts/AppSettingContext";
import EmptyStateSection from "@/components/news/section/EmptyStateSection";
import MobileStaffPicksSection from "@/components/news/section/mobileSections/MobileStaffPicksSection";
import OnboardingAutoOpen from "@/components/onboarding/OnboardingAutoOpen";
import PageMeta from "@/components/common/seo/PageMeta";

export default function HomePage() {
	const { t } = useTranslation();
	const isAllSectionNotVisible = useAllSectionNotVisible();
	const { resetSectionVisibility } = useAppSettings();
	return (
		<>
			<PageMeta
				title={t("SEO.HOME.TITLE")}
				description={t("SEO.HOME.DESCRIPTION")}
			/>
			{/* Renders nothing — mounting it here is what scopes the first-visit
			    tour to the home page (see OnboardingAutoOpen for the timing gate) */}
			<OnboardingAutoOpen />
			<FeaturedSection />
			<MobileStaffPicksSection />
			<RecommendedSection />
			<PopularSection />
			<EditorsSection variant="mobile" />
			<CatFactsSection variant="mobile" />
			<HomeNewsSection key={"home-article-section"} />
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
