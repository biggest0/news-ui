import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

import { ARTICLE_ROUTES } from "@/constants/routes";
import type { AppDispatch } from "@/store/store";
import { loadArticlesInfoByCategory } from "@/store/articlesSlice";

export default function CategoryBar() {
	// get url/{category}
	const location = useLocation();
	const currentCategory = location.pathname.split("/")[1]; // grabs part after "/"
	const scrollRef = useRef<HTMLDivElement>(null);

	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const dispatch = useDispatch<AppDispatch>();
	// instead of setting the category, you link it
	// and then in sections just grab the param again and filter
	useEffect(() => {
		if (currentCategory === "") {
			// defaults to grabbing all articles
			dispatch(
				loadArticlesInfoByCategory({ page: 1, category: currentCategory })
			);
		} else if (ARTICLE_ROUTES.includes(currentCategory)) {
			dispatch(
				loadArticlesInfoByCategory({ page: 1, category: currentCategory })
			);
		}
	}, [currentCategory, dispatch]);

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
		<nav className="border-b-2 pb-2">
			<div className="relative w-full">
				{/* Left arrow */}
				{canScrollLeft && (
					<button
						onClick={() => scrollBy(-100)}
						className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white via-white/90 to-transparent pr-4"
					>
						<GoChevronLeft
							className="w-4 h-4 text-gray-600 transition-opacity duration-200
			"
						/>
					</button>
				)}
				{/* Scrollable category list */}
				<div
					ref={scrollRef}
					className="w-full overflow-x-auto hide-scrollbar scroll-smooth"
				>
					<div className="flex border-gray-500 min-w-max md:justify-center">
						{ARTICLE_ROUTES.map((category, index) => (
							<Link
								key={category}
								to={`/${category}`}
								className={`cursor-pointer lg:pt-1 text-base md:text-lg font-medium whitespace-nowrap ${
									currentCategory === category
										? "text-amber-600 underline"
										: "text-gray-600 hover:text-black"
								} ${index !== 0 ? "ml-6" : ""}`}
							>
								{category.toUpperCase()}
							</Link>
						))}
					</div>
				</div>
				{/* Right arrow */}
				{canScrollRight && (
					<button
						onClick={() => scrollBy(100)}
						className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white via-white/90 to-transparent pl-4"
					>
						<GoChevronRight
							className="w-4 h-4 text-gray-600 transition-opacity duration-200
			"
						/>
					</button>
				)}
			</div>
		</nav>
	);
}
