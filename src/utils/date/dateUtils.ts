/** True when the given date string falls within the last `days` days. */
export function isWithinNDays(dateString: string, days: number): boolean {
	const todayDate = new Date();
	const inputDate = new Date(dateString);

	const todayUTC = Date.UTC(
		todayDate.getFullYear(),
		todayDate.getMonth(),
		todayDate.getDate()
	);
	const inputUTC = Date.UTC(
		inputDate.getFullYear(),
		inputDate.getMonth(),
		inputDate.getDate()
	);

	const diffInMs = todayUTC - inputUTC;
	const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
	return diffInDays <= days;
}

/**
 * Converts a blog post's `M/D/YYYY` date to the `YYYY-MM-DD` form that
 * `<time dateTime>` and schema.org expect.
 *
 * Returns undefined when the input doesn't match, so callers omit the
 * attribute rather than emit a wrong one. Mirrors `toW3CDate()` in
 * scripts/prerenderRoutes.mjs, which does the same job at build time.
 * @param date - e.g. `"8/18/2026"`
 * @returns e.g. `"2026-08-18"`, or undefined
 */
export function toIsoDate(date: string | undefined): string | undefined {
	const parts = date?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	if (!parts) return undefined;

	const [, month, day, year] = parts;
	return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
