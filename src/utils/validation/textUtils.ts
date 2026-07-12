/** Basic email shape check used by the subscribe + auth forms. */
export function validateEmail(email: string): boolean {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
}

/** Trims and lowercases an email before validation/submission. */
export function cleanseEmail(email: string): string {
	return email.trim().toLowerCase();
}
