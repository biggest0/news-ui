import { useTranslation } from "react-i18next";
import { IoCheckmark } from "react-icons/io5";
import { HiMiniLanguage } from "react-icons/hi2";

import type { Language } from "@/i18n/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface LanguageOption {
	code: Language;
	label: string;
}

/**
 * Header language menu — built on the DropdownMenu primitive since M5.5
 * (arrow-key navigation, Escape, focus return, aria-haspopup/expanded for
 * free; the hand-rolled click-outside/escape listeners are gone).
 */
export default function LanguageSwitcherDesktop() {
	const { i18n, t } = useTranslation();

	const languages: LanguageOption[] = [
		{ code: "en", label: t("LANGUAGE.EN") },
		{ code: "fr", label: t("LANGUAGE.FR") },
	];

	const currentLanguage = i18n.language as Language;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={t("COMMON.LANGUAGE")}
				className="flex cursor-pointer items-center justify-center rounded outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
			>
				<HiMiniLanguage className="w-6 h-6 transition-colors" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map(({ code, label }) => (
					<DropdownMenuItem
						key={code}
						onClick={() => i18n.changeLanguage(code)}
						className={currentLanguage === code ? "text-brand" : undefined}
					>
						<span>{code.toUpperCase()}</span>
						<span className="font-medium flex-1">{label}</span>
						{currentLanguage === code && (
							<IoCheckmark size={18} className="text-brand" />
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
