import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { GrLanguage } from "react-icons/gr";
import { IoCheckmark } from "react-icons/io5";

type Language = "en" | "fr";

interface LanguageOption {
	code: Language;
	label: string;
}

export default function LanguageSwitcherDesktop() {
	const { i18n, t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const languages: LanguageOption[] = [
		{ code: "en", label: t("LANGUAGE.EN") },
		{ code: "fr", label: t("LANGUAGE.FR") },
	];

	const currentLanguage = i18n.language as Language;
	// const currentLangOption = languages.find(
	// 	(lang) => lang.code === currentLanguage
	// );

	const changeLanguage = (language: Language) => {
		i18n.changeLanguage(language);
		setIsOpen(false);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Close on escape key
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen]);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-center"
				aria-label="Change language"
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				<GrLanguage size={20} className="text-gray-700" />
			</button>

			{isOpen && (
				<div className="absolute top-6 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
					<div className="py-1">
						{languages.map(({ code, label }) => (
							<button
								key={code}
								onClick={() => changeLanguage(code)}
								className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
									currentLanguage === code ? "text-amber-600" : "text-gray-600"
								}`}
							>
								<span className="">{code.toUpperCase()}</span>
								<span className="font-medium flex-1">{label}</span>
								{currentLanguage === code && (
									<IoCheckmark size={18} className="text-amber-600" />
								)}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
