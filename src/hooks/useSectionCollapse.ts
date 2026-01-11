import type { AppSetting } from "@/types/localStorageTypes";
import { getAppSetting } from "@/utils/storage/localStorageUtils";
import { useEffect, useState } from "react";

const NEWS_SECTION_CHANGE_EVENT = "newsSectionChange";

export function useSectionCollapse() {
  // Placeholder for future implementation of section collapse logic
  const [isCollapsed, setIsCollapsed] = useState(() => getAppSetting().homeLayout.expanded.newsSection);

  useEffect(() => {
		const handleChange = (event: CustomEvent<boolean>) => {
      console.log('ran', event.detail)
			setIsCollapsed(event.detail);
		};

		window.addEventListener(
			NEWS_SECTION_CHANGE_EVENT,
			handleChange as EventListener
		);
		return () => {
			window.removeEventListener(
				NEWS_SECTION_CHANGE_EVENT,
				handleChange as EventListener
			);
		};
	}, []);

  return isCollapsed;
}