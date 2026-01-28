import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function LanguageSwitcher() {
	const { i18n, t } = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);

	const languages = [
		{ code: "en", label: t("LANGUAGE.EN") },
		{ code: "fr", label: t("LANGUAGE.FR") },
	];

	// Update language in localStorage, hide expand
	const changeLanguage = (language: string) => {
		i18n.changeLanguage(language);
		setIsExpanded(false);
	};

	return (
		<div
			className="flex items-center px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
			onClick={() => setIsExpanded(!isExpanded)}
		>
			<div className="cursor-pointer mr-4">{t("COMMON.LANGUAGE")}</div>

			{/* Expandable Language List */}
			<div
				className={`flex overflow-x-auto scrollbar-hide transition-all duration-300 ${
					isExpanded ? "opacity-100" : "max-w-0 opacity-0"
				}`}
			>
				{languages.map((language) => (
					<button
						key={language.code}
						onClick={() => changeLanguage(language.code)}
						className={`px-4 py-2 whitespace-nowrap transition-colors ${
							i18n.language === language.code
								? "underline"
								: "hover:text-amber-600 cursor-pointer"
						}`}
					>
						{language.label}
					</button>
				))}
			</div>
		</div>
	);
}
