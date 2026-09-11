/** Uppercases the first letter of a word (rest unchanged). */
export const capitalizeWord = (str: string | undefined): string => {
	if (!str || str.length === 0) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Shortens text to at most `max` characters for a meta description, cutting
 * at the last word boundary and appending an ellipsis. Returns the text
 * unchanged when it already fits.
 * @param text - source text, e.g. an article's first paragraph
 * @param max - character budget (search engines show roughly 155)
 */
export const truncateText = (text: string, max = 155): string => {
	if (text.length <= max) return text;
	const cut = text.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(" ");
	return `${(lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};
