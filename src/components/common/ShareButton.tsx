import { useState } from "react";
import { CiShare1 } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";

export const ShareButton = ({ articleId }: { articleId: string }) => {
	const [copied, setCopied] = useState(false);

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
				!copied ? "hover:text-amber-500" : ""
			}`}
		>
			{copied ? (
				<>
					<FaCheck className="w-4 h-4" />
				</>
			) : (
				<>
					<CiShare1 className="w-4 h-4" />
					<span>Share</span>
				</>
			)}
		</button>
	);
};
