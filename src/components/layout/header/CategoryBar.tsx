import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

import { ARTICLE_ROUTES } from "@/constants/routes";
import type { CategoryKey } from "@/i18n/types";

/**
 * Horizontal category navigation in the header. Pure navigation since M5 —
 * the pages own their data fetching via RTK Query hooks (this component used
 * to dispatch the initial article loads and refire them on language change).
 */
export default function CategoryBar() {
	// get url/{category}
	const location = useLocation();
	const { t } = useTranslation();
	const currentCategory = location.pathname.split("/")[1]; // grabs part after "/"
	const scrollRef = useRef<HTMLDivElement>(null);

	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	// Set up scroll listeners
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		checkScroll();
		el.addEventListener("scroll", checkScroll);
		window.addEventListener("resize", checkScroll);
		return () => {
			el.removeEventListener("scroll", checkScroll);
			window.removeEventListener("resize", checkScroll);
		};
	}, []);

	// Check if can scroll left or right
	const checkScroll = () => {
		const el = scrollRef.current;
		if (!el) return;
		setCanScrollLeft(el.scrollLeft > 10);
		setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 10);
	};

	// Smooth scroll by offset
	const scrollBy = (offset: number) => {
		scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
	};

	return (
		<nav className="border-b-2 border-border-subtle pb-2 transition-colors duration-200">
			<div className="relative w-full">
				{/* Left arrow */}
				{canScrollLeft && (
					<button
						onClick={() => scrollBy(-100)}
						className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-background via-background/90 to-transparent pr-4"
					>
						<GoChevronLeft
							className="w-4 h-4 text-muted-foreground transition-opacity duration-200"
						/>
					</button>
				)}
				{/* Scrollable category list */}
				<div
					ref={scrollRef}
					className="w-full overflow-x-auto hide-scrollbar scroll-smooth"
				>
					<div className="flex border-border min-w-max md:justify-center">
						{ARTICLE_ROUTES.map((category, index) => (
							<Link
								key={category}
								to={`/${category}`}
								className={`cursor-pointer lg:pt-1 text-base md:text-lg font-medium whitespace-nowrap transition-colors ${
									currentCategory === category
										? "text-brand underline"
										: "text-foreground-secondary hover:text-foreground"
								} ${index !== 0 ? "ml-6" : ""}`}
							>
								{t(`CATEGORY.${category.toUpperCase() as CategoryKey}`).toUpperCase()}
							</Link>
						))}
					</div>
				</div>
				{/* Right arrow */}
				{canScrollRight && (
					<button
						onClick={() => scrollBy(100)}
						className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-background via-background/90 to-transparent pl-4"
					>
						<GoChevronRight
							className="w-4 h-4 text-muted-foreground transition-opacity duration-200"
						/>
					</button>
				)}
			</div>
		</nav>
	);
}
