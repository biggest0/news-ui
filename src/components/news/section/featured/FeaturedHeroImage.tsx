import { useTranslation } from "react-i18next";

import Image from "@/assets/news_hero_image.webp";

/**
 * Press-photo treatments for the home page hero.
 *
 * `ruled` is what the site uses; the other two are kept as working alternates
 * so the look can be switched from a single default in `FeaturedSection`
 * rather than rebuilt. Two further variants (a scrim overlay and a grayscale
 * newsprint treatment) were compared and dropped.
 */
export type HeroImageVariant = "ruled" | "cutline" | "matted";

interface FeaturedHeroImageProps {
	variant: HeroImageVariant;
}

/** Grid placement every variant shares: the middle 2x2 block of the hero. */
const CELL = "col-span-2 row-span-2";

/**
 * The home page's featured press photo, in one of several print-inspired
 * treatments.
 *
 * Rendered at a fixed 1024x685 with high fetch priority because it is the
 * home page's LCP element; every variant keeps those attributes so switching
 * between them cannot change loading behaviour.
 *
 * @param variant - Which treatment to render
 */
export default function FeaturedHeroImage({ variant }: FeaturedHeroImageProps) {
	const { t } = useTranslation();

	/**
	 * The photo, absolutely positioned inside a box that flexes to fill the
	 * cell.
	 *
	 * The positioning is load-bearing, not decoration. Laid out normally, the
	 * image's intrinsic 1024x685 becomes its max-content contribution, and a
	 * grid row sized to its contents then tracks the photo rather than the
	 * article columns: the band came out ~70px taller than FeaturedSection's
	 * min-height asks for, at every viewport width. Out of flow it contributes
	 * nothing, so the band sits at its minimum and only grows when a column
	 * genuinely needs the room.
	 *
	 * @param className - Variant-specific classes for the box (sizing, border,
	 *   spacing)
	 */
	const photo = (className: string) => (
		<div className={`relative ${className}`}>
			<img
				src={Image}
				alt={t("HERO.IMAGE_ALT")}
				width={1024}
				height={685}
				fetchPriority="high"
				decoding="async"
				className="absolute inset-0 h-full w-full object-cover"
			/>
		</div>
	);

	const quote = t("HERO.QUOTE");
	const attribution = t("HERO.QUOTE_ATTRIBUTION");
	const credit = t("HERO.IMAGE_CREDIT");

	switch (variant) {
		// ── In use: photo flush to the top of the grid row, closed by a rule ──
		// No rule above it: the photo's top edge lines up with the headlines in
		// the columns either side, which is what keeps the row reading as one
		// band rather than three stacked things. The rule underneath seats the
		// caption the way a newspaper closes a cutline.
		case "ruled":
			return (
				<figure className={`${CELL} flex flex-col`}>
					{photo("w-full flex-1 min-h-0 mb-2")}
					<div className="border-t border-border" />
					<figcaption className="mt-2 text-center">
						<blockquote className="text-sm italic leading-snug text-foreground-secondary">
							{quote}
						</blockquote>
						<cite className="mt-1 block text-[0.625rem] uppercase tracking-widest not-italic text-muted-foreground">
							{attribution}
						</cite>
					</figcaption>
				</figure>
			);

		// ── Alternate: hairline keyline, caption and credit set below ──
		// Closest to how a paper sets caption copy under a photo.
		case "cutline":
			return (
				<figure className={`${CELL} flex flex-col`}>
					{photo("w-full flex-1 min-h-0 border border-border-subtle")}
					<figcaption className="mt-2 flex items-baseline justify-between gap-4 border-b border-border-subtle pb-2">
						<blockquote className="text-sm italic leading-snug text-foreground-secondary">
							{quote}
							<cite className="ml-1 not-italic text-muted-foreground">
								{attribution}
							</cite>
						</blockquote>
						<span className="shrink-0 text-[0.625rem] uppercase tracking-widest text-muted-foreground">
							{credit}
						</span>
					</figcaption>
				</figure>
			);

		// ── Alternate: photo inset in a bordered card, caption inside the mat ──
		// Reads as a framed plate rather than part of the page grid.
		case "matted":
			return (
				<figure
					className={`${CELL} flex flex-col border border-border bg-card p-3`}
				>
					{photo("w-full flex-1 min-h-0")}
					<figcaption className="mt-3 text-center">
						<blockquote className="font-heading text-base leading-snug text-foreground">
							{quote}
						</blockquote>
						<cite className="mt-1 block text-[0.625rem] uppercase tracking-widest not-italic text-muted-foreground">
							{attribution} {"·"} {credit}
						</cite>
					</figcaption>
				</figure>
			);
	}
}
