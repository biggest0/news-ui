import { useTranslation } from "react-i18next";

export default function NoticeBar() {
	const { t } = useTranslation();
	
	return (
		<div className="bg-warning-subtle border-l-4 border-warning-border text-warning p-2 flex items-center justify-center text-sm">
			{t("NOTICE.SATIRE_MESSAGE")}
		</div>
	);
}
