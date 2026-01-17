import FeaturedSection from "@/components/news/section/FeaturedSection";
import BackToTopButton from "@/components/common/navigation/BackToTopButton";
import { HomeNewsSection } from "@/components/news/section/newsSections/HomeNewsSection";
import PopularSection from "@/components/news/section/PopularSection";
import MobileEditorsSection from "@/components/news/section/mobileSections/MobileEditorsSection";
import MobileCatFactsSection from "@/components/news/section/mobileSections/MobileCatFactsSection";
import { useAllSectionNotVisible } from "@/hooks/useSectionCollapse";
import { useAppSettings } from "@/contexts/AppSettingContext";
import EmptyStateSection from "@/components/news/section/EmptyStateSection";

export default function HomePage() {
	const isAllSectionNotVisible = useAllSectionNotVisible();
	const { resetSectionVisibility } = useAppSettings();
	return (
		<>
			<FeaturedSection />
			<PopularSection />
			<MobileEditorsSection />
			<MobileCatFactsSection />
			<HomeNewsSection key={"home-article-section"} />
			{/* section to reset sections */}
			<EmptyStateSection
				isVisible={isAllSectionNotVisible}
				resetSectionVisibility={resetSectionVisibility}
				message="Looks like you removed every section"
				buttonText="Reset To Default"
			/>
			<BackToTopButton />
		</>
	);
}
