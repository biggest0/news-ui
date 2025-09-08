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
