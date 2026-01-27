import { useState } from "react";
import { CiShare1 } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export const ShareButton = ({ articleId }: { articleId: string }) => {
	const [copied, setCopied] = useState(false);
	const { t } = useTranslation();

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(
				`https://www.catiretime.com/article/${articleId}`
			);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy article link: ", error);
		}
	};

	return (
		<button
			onClick={handleCopy}
			className={`flex items-center gap-2 transition-colors duration-200 ${
				!copied ? "hover:text-amber-600" : ""
			}`}
		>
			{copied ? (
				<>
					<IoCheckmark className="w-4 h-4" />
					<span>{t("COMMON.COPIED")}</span>
				</>
			) : (
				<>
					<CiShare1 className="w-4 h-4" />
					<span>{t("COMMON.SHARE")}</span>
				</>
			)}
		</button>
	);
};
