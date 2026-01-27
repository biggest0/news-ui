import { useTranslation } from "react-i18next";

export default function NoticeBar() {
	const { t } = useTranslation();
	
	return (
		<div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 flex items-center justify-center text-sm">
			{t("NOTICE.SATIRE_MESSAGE")}
		</div>
	);
}
