import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CiShare1 } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";

import { articlePath } from "@/constants/routes";
import { absoluteUrl } from "@/utils/seo/urlUtils";

/**
 * Copies the article's share link; icon-only, labelled for screen readers.
 * The link is the article's canonical URL (same builder as <PageMeta> and the
 * sitemap), so shared links, canonical tags and sitemap entries all agree.
 */
export const ShareButton = ({ articleId }: { articleId: string }) => {
	const { t } = useTranslation();
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(absoluteUrl(articlePath(articleId)));
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy article link: ", error);
		}
	};

	return (
		<button
			aria-label={copied ? t("COMMON.COPIED") : t("COMMON.SHARE")}
			onClick={handleCopy}
			className={`flex items-center gap-2 transition-colors duration-200 ${
				!copied ? "hover:text-brand" : ""
			}`}
		>
			{copied ? (
				<IoCheckmark className="w-4 h-4" />
			) : (
				<CiShare1 className="w-4 h-4" />
			)}
		</button>
	);
};
