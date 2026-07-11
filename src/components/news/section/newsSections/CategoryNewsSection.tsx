import { useLocation } from "react-router-dom";

import { BaseNewsSection } from "./BaseNewsSection";

/**
 * Category feed — the category comes from the route and keys its own RTK
 * Query cache entry (no more shared store array + client-side re-filtering).
 */
export function CategoryNewsSection() {
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];

	return <BaseNewsSection category={selectedCategory} />;
}
