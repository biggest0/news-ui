import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import CatLoading from "@/assets/cat_loading.gif";

export const LoadingOverlay = ({ loading }: { loading: boolean }) => {
	const { t } = useTranslation();
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
				className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-gray-700 transition-opacity duration-300 ${
					loading ? "opacity-100" : "opacity-0"
				}`}
			>
				<img src={CatLoading} alt={t("COMMON.LOAD")} className="w-32 h-32" />
				<div>{t("COMMON.LOADING")}</div>
			</div>
		)
	);
};
