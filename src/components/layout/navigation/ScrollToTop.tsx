import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
	const { pathname } = useLocation();
	const navigationType = useNavigationType();

	useEffect(() => {
		// Only scroll to top if navigation is a PUSH (clicking a Link, etc)
		if (navigationType === "PUSH") {
			window.scrollTo({ top: 0, left: 0, behavior: "instant" });
		}
		// If it's POP (back/forward), do nothing, browser will handle restoring scroll
	}, [pathname, navigationType]);

	return null;
}
