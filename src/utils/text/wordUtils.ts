/** Uppercases the first letter of a word (rest unchanged). */
export const capitalizeWord = (str: string | undefined): string => {
	if (!str || str.length === 0) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
};
