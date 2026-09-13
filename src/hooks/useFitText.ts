import { useCallback, useLayoutEffect, useRef, useState } from "react";

/** Font size the text is measured at before scaling. Arbitrary but large
 *  enough that rounding in the measurement does not matter. */
const REFERENCE_SIZE = 100;

/**
 * Scales one line of text so it exactly fills the width of its parent.
 *
 * "Fill the width" cannot be written as a fixed font size here, because the
 * same slot holds strings of very different lengths: "Quick Reads" needs
 * ~11.9vw to reach the edges while "Lectures rapides" needs ~8.6vw, so any
 * single value either overflows one language or leaves the other short. The
 * text is measured at a reference size instead and scaled from what it
 * actually is.
 *
 * Re-measures when the text changes (a language switch), when the container
 * resizes (rotation, a resized window), and once webfonts have finished
 * loading, since the fallback serif's metrics differ from Cardo's and a size
 * derived from the fallback would be wrong by a few percent.
 *
 * @param text - The rendered string; changing it triggers a re-measure
 * @returns `ref` for the text element, and the `fontSize` in px to apply
 *   (undefined until the first measurement, so render a sensible CSS fallback)
 */
export function useFitText<T extends HTMLElement>(text: string) {
	const ref = useRef<T>(null);
	const [fontSize, setFontSize] = useState<number>();

	const measure = useCallback(() => {
		const element = ref.current;
		const container = element?.parentElement;
		if (!element || !container) return;

		const available = container.clientWidth;
		if (!available) return;

		// Measure at a known size on one unwrapped line, then restore whatever
		// was there so this never paints an intermediate state.
		//
		// `width: max-content` is what makes this work in both directions.
		// These are block elements, so scrollWidth never reports less than the
		// container's width: the moment the text is narrower than its column
		// the measurement reads as an exact fit and the size stops growing.
		// That is invisible on a phone, where the text always overflows at the
		// reference size, and wrong on every desktop width.
		const previousSize = element.style.fontSize;
		const previousWrap = element.style.whiteSpace;
		const previousWidth = element.style.width;
		element.style.fontSize = `${REFERENCE_SIZE}px`;
		element.style.whiteSpace = "nowrap";
		element.style.width = "max-content";
		const naturalWidth = element.getBoundingClientRect().width;
		element.style.fontSize = previousSize;
		element.style.whiteSpace = previousWrap;
		element.style.width = previousWidth;
		if (!naturalWidth) return;

		setFontSize((available / naturalWidth) * REFERENCE_SIZE);
	}, []);

	// Text content is the other input to the measurement, alongside width.
	useLayoutEffect(() => {
		measure();
	}, [measure, text]);

	useLayoutEffect(() => {
		const container = ref.current?.parentElement;
		if (!container) return;

		const observer = new ResizeObserver(measure);
		observer.observe(container);
		// Webfonts usually land after first paint; the size is wrong until they do.
		document.fonts?.ready.then(measure).catch(() => {});

		return () => observer.disconnect();
	}, [measure]);

	return { ref, fontSize };
}
