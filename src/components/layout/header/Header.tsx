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
			    
			    Opaque, not the bg-elevated-glass token its comment advertises for
			    this ("translucent sticky surfaces (navbar on scroll)"). At 50% white
			    the headlines passing underneath stayed legible straight through the
			    category labels, even at backdrop-blur-xl. A frosted bar is also a
			    modern-app idiom rather than a newspaper one: the masthead of a paper
			    sits on paper. */}
			<header className="sticky top-0 z-30 bg-background">
				<div className="w-full max-w-[1280px] mx-auto px-4">
					<NavBar />
					<CategoryBar />
				</div>
			</header>
		</>
	);
}
