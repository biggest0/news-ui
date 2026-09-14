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
 * Vertical rhythm lives in `.masthead-title` / `.masthead-tagline`
 * (index.css): they trim the blank space a font reserves above its capitals
 * and below its baseline, which at this size is larger than the wrapper's
 * own padding. With the trim, `py-6` on the wrapper measures from the ink.
 * Don't add `mt-*` / `mb-*` here; the gap between the lines is set there too.
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
			<h2
				ref={title.ref}
				style={{ fontSize: title.fontSize }}
				className="masthead-title font-masthead text-3xl leading-none whitespace-nowrap uppercase text-foreground"
			>
				{t("HERO.TITLE")}
			</h2>
			<p
				ref={tagline.ref}
				style={{ fontSize: tagline.fontSize }}
				className="masthead-tagline font-masthead text-sm leading-none whitespace-nowrap text-muted-foreground"
			>
				{t("HERO.TAGLINE")}
			</p>
		</header>
	);
}
