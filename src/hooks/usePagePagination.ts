import { useState, useEffect } from "react";
import { getAppSetting } from "@/utils/storage/localStorageUtils";

const PAGE_PAGINATION_CHANGE_EVENT = "pagePaginationChange";

/**
 * Hook to manage page pagination setting with reactive updates.
 * Keeps component in sync when togglePagePagination is called from anywhere.
 */
export function usePagePagination() {
	const [isPaginationEnabled, setIsPaginationEnabled] = useState(() => {
		return getAppSetting().homeLayout.pagePagination;
	});

	// Listen for changes from other components
	useEffect(() => {
		const handleChange = (event: CustomEvent<boolean>) => {
			setIsPaginationEnabled(event.detail);
		};

		window.addEventListener(
			PAGE_PAGINATION_CHANGE_EVENT,
			handleChange as EventListener
		);
		return () => {
			window.removeEventListener(
				PAGE_PAGINATION_CHANGE_EVENT,
				handleChange as EventListener
			);
		};
	}, []);

	return { isPaginationEnabled };
}
