import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronUp } from "react-icons/fa6";

export default function BackToTopButton() {
	const { t } = useTranslation();
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			window.requestAnimationFrame(() => {
				setShowButton(window.scrollY > window.innerHeight);
			});
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			{showButton && (
				<button
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					className="fixed bottom-8 right-8 w-14 h-14 flex items-center justify-center rounded-full text-gray-400 bg-white/50 shadow-lg hover:bg-amber-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out z-20"
					aria-label={t("COMMON.BACK_TO_TOP")}
					title={t("COMMON.BACK_TO_TOP")}
				>
					<FaChevronUp />
				</button>
			)}
		</>
	);
}
