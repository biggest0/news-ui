import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { useFitText } from "@/hooks/useFitText";

interface FeaturedMastheadProps {
	/** Placement and spacing for the wrapping `<header>`. */
	className?: string;
}

/**
 * The home page's standing masthead: a display heading over a tagline, both
 * scaled to fill their column edge to edge.
 *
 * A heading for the page, not a caption for the press photo, so it sits
 * outside `FeaturedHeroImage`'s `<figure>` rather than in its `<figcaption>`.
 * Rendered twice by design, once per layout: the mobile section places it
 * above its photo, the home page places it above the desktop hero. Sharing
 * one component keeps the two in step, which is what went wrong the last time
 * this copy lived in two places.
 *
 * Both lines are sized by `useFitText` rather than given a fixed size: the
 * strings differ enough between languages that no single value fills both
 * ("Quick Reads Only" wants roughly 40% more width than the French).
 *
 * @param className - Placement/spacing for the wrapper
 */
export default function FeaturedMasthead({ className }: FeaturedMastheadProps) {
	const { t } = useTranslation();
	const title = useFitText<HTMLHeadingElement>(t("HERO.TITLE"));
	const tagline = useFitText<HTMLParagraphElement>(t("HERO.TAGLINE"));

	return (
		<header className={cn("text-center", className)}>
			{/* Uppercased in CSS rather than in the copy, the way the other section
			    labels are, so French renders with its accents intact. The text-*
			    sizes are only the pre-measurement fallback; useFitText overrides
			    them once it has measured. */}
			{/*
			 * -mt-[0.09em]: why this exists, because it looks like a stray magic
			 * number and is not one.
			 *
			 * It is NOT the section's spacing. The wrapper already uses the
			 * standard `border-b border-border py-6` that SectionShell gives
			 * every other section, and that 24px is untouched.
			 *
			 * What it cancels is the blank space a font reserves above its
			 * capitals inside the line box. That space is proportional to the
			 * font size, so it is invisible on a normal heading and enormous
			 * here:
			 *
			 *     16px heading  ->  ~4px reserved   (why POPULAR's caps sit
			 *                                        28px below its top edge,
			 *                                        not 24px)
			 *     128px masthead -> ~24px reserved  (padding + leading = ~48px,
			 *                                        double every other section)
			 *
			 * Measured, not assumed: Playfair Display's ink starts 0.185em below
			 * the element's box top (rasterised and pixel-scanned, since the
			 * published metrics do not tell you where the ink actually lands).
			 *
			 * Why em and not a static px like the rest of the codebase: the font
			 * size is not static. useFitText scales it to fill its column, so it
			 * is ~33px on a phone and ~128px on a wide desktop, and the reserved
			 * space scales with it (~6px vs ~24px). A static -mt-6 would be right
			 * on desktop and crush the phone to a 6px gap; -mt-2 would fix the
			 * phone and leave desktop at 40px. One em value holds at both, because
			 * it is a proportion of exactly the thing it is cancelling.
			 *
			 * Calibrated to 0.09em against POPULAR, the nearest peer (the other
			 * bordered py-6 block in page flow): both now put their capitals 28px
			 * below their own top edge on desktop, 25px vs 28px on mobile.
			 *
			 * If this ever looks wrong, check the font first. The 0.185em is a
			 * property of Playfair Display; swapping --font-masthead invalidates
			 * it and the trim needs re-measuring.
			 */}
			<h2
				ref={title.ref}
				style={{ fontSize: title.fontSize }}
				className="-mt-[0.09em] font-masthead text-3xl leading-none whitespace-nowrap uppercase text-foreground"
			>
				{t("HERO.TITLE")}
			</h2>
			<p
				ref={tagline.ref}
				style={{ fontSize: tagline.fontSize }}
				className="mt-2 font-masthead text-sm leading-none whitespace-nowrap text-muted-foreground"
			>
				{t("HERO.TAGLINE")}
			</p>
		</header>
	);
}
