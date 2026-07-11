import { BaseNewsSection } from "./BaseNewsSection";

/**
 * Home feed (all categories) — BaseNewsSection owns data fetching via RTK
 * Query; the overlay covers the initial home load.
 */
export function HomeNewsSection() {
	return <BaseNewsSection overlayOnInitialLoad />;
}
