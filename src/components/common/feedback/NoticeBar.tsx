import { useTranslation } from "react-i18next";

export default function NoticeBar() {
	const { t } = useTranslation();
	
	return (
		<div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400 p-2 flex items-center justify-center text-sm">
			{t("NOTICE.SATIRE_MESSAGE")}
		</div>
	);
}
