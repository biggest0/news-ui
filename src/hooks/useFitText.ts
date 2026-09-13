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
		const previousSize = element.style.fontSize;
		const previousWrap = element.style.whiteSpace;
		element.style.fontSize = `${REFERENCE_SIZE}px`;
		element.style.whiteSpace = "nowrap";
		const naturalWidth = element.scrollWidth;
		element.style.fontSize = previousSize;
		element.style.whiteSpace = previousWrap;
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
