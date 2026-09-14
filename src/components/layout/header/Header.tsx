import NoticeBar from "@/components/common/feedback/NoticeBar";
import NavBar from "@/components/layout/navBar/NavBar";
import CategoryBar from "@/components/layout/header/CategoryBar";

export default function Header() {
	return (
		<>
			{/* Outside the sticky element, and a sibling of it rather than a child:
			    the satire notice is read once, and a sticky box can only travel
			    inside its own parent's box. Nesting the bar in a wrapper that also
			    held the notice gave it a parent no taller than itself, so it
			    scrolled away with the page and never stuck at all. */}
			<div className="w-full max-w-[1280px] mx-auto px-4">
				<NoticeBar />
			</div>

			{/* Wordmark and categories stick together as one unit. Full-bleed so
			    the bar spans the viewport, with its content held to the same 1280px
			    column as the rest of the page. z-30 clears the article content and
			    the back-to-top button, both at z-20.

			    Frosted, not opaque: content scrolling under the bar shows through as
			    a soft, blurred tint. bg-background-glass, not bg-elevated-glass:
			    the two differ in dark mode, where elevated-glass is a step lighter
			    than the page (right for the floating back-to-top button, wrong
			    here, where it drew a lighter band across the top). The token is 80%
			    (not the 50% it started
			    at, where headlines stayed legible straight through the category
			    labels) and the blur does the rest. No scroll listener is needed for
			    "only when scrolled": at the top of the page there is nothing under
			    the bar but page background, so the glass is invisible until content
			    passes beneath it. Browsers without backdrop-filter fall back to the
			    opaque paper bar, since 85% without blur just looks broken. */}
			<header className="sticky top-0 z-30 bg-background supports-backdrop-filter:bg-background-glass supports-backdrop-filter:backdrop-blur-lg">
				<div className="w-full max-w-[1280px] mx-auto px-4">
					<NavBar />
					<CategoryBar />
				</div>
			</header>
		</>
	);
}
