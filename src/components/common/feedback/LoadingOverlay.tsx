import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSettings } from "@/contexts/AppSettingContext";

import CatLoading from "@/assets/cat_loading.gif";
import CatLoadingDark from "@/assets/cat_loading_dark.gif";

export const LoadingOverlay = ({ loading }: { loading: boolean }) => {
	const { t } = useTranslation();
	const { isDarkMode } = useAppSettings();
	const [show, setShow] = useState(loading);

	// Handle fade-out effect
	useEffect(() => {
		if (loading) setShow(true);
		else {
			const timer = setTimeout(() => setShow(false), 300); // match the transition duration
			return () => clearTimeout(timer);
		}
	}, [loading]);
	return (
		show && (
			<div
				className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground-secondary transition-opacity duration-300 ${
					loading ? "opacity-100" : "opacity-0"
				}`}
			>
				{/* One <img>, picked in JS rather than two swapped with `dark:` classes:
				    a hidden <img> is still fetched, so the class-based version pulled
				    both GIFs (~22KB wasted) on every load — on the overlay that shows
				    during the *initial* load, at that. */}
				<img
					src={isDarkMode ? CatLoadingDark : CatLoading}
					alt={t("COMMON.LOAD")}
					className="w-32 h-32"
				/>
				<div>{t("COMMON.LOADING")}</div>
			</div>
		)
	);
};
