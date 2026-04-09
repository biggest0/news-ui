import { describe, it, expect, vi, afterEach } from "vitest";
import { isWithinNDays } from "@/utils/date/dateUtils";

describe("isWithinNDays", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	function freezeDate(isoDate: string) {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(isoDate));
	}

	// Build a locale date string N days before "now" using local-time arithmetic,
	// matching the format the production mapper generates (toLocaleDateString).
	function daysAgo(n: number): string {
		const d = new Date();
		d.setDate(d.getDate() - n);
		return d.toLocaleDateString();
	}

	function daysAhead(n: number): string {
		const d = new Date();
		d.setDate(d.getDate() + n);
		return d.toLocaleDateString();
	}

	it("returns true for today's date with 1 day", () => {
		freezeDate("2026-03-27T12:00:00");
		expect(isWithinNDays(daysAgo(0), 1)).toBe(true);
	});

	it("returns true for yesterday with 1 day", () => {
		freezeDate("2026-03-27T12:00:00");
		expect(isWithinNDays(daysAgo(1), 1)).toBe(true);
	});

	it("returns false for 2 days ago with 1 day", () => {
		freezeDate("2026-03-27T12:00:00");
		expect(isWithinNDays(daysAgo(2), 1)).toBe(false);
	});

	it("returns true for exactly N days ago (boundary)", () => {
		freezeDate("2026-03-27T12:00:00");
		expect(isWithinNDays(daysAgo(7), 7)).toBe(true);
	});

	it("returns false for N+1 days ago (just outside boundary)", () => {
		freezeDate("2026-03-27T12:00:00");
		expect(isWithinNDays(daysAgo(8), 7)).toBe(false);
	});

	it("returns true for future dates (negative diff)", () => {
		freezeDate("2026-03-27T12:00:00");
		expect(isWithinNDays(daysAhead(3), 1)).toBe(true);
	});

	it("handles 30-day range correctly", () => {
		freezeDate("2026-03-27T12:00:00");
		expect(isWithinNDays(daysAgo(30), 30)).toBe(true);
		expect(isWithinNDays(daysAgo(31), 30)).toBe(false);
	});

	it("handles cross-year boundary", () => {
		freezeDate("2026-01-02T12:00:00");
		expect(isWithinNDays(daysAgo(2), 7)).toBe(true);
		expect(isWithinNDays(daysAgo(8), 7)).toBe(false);
	});

	it("handles 0 days — only today is valid", () => {
		freezeDate("2026-03-27T12:00:00");
		expect(isWithinNDays(daysAgo(0), 0)).toBe(true);
		expect(isWithinNDays(daysAgo(1), 0)).toBe(false);
	});

	it("handles locale date string format (from toLocaleDateString)", () => {
		freezeDate("2026-03-27T12:00:00");
		const localeDateStr = new Date().toLocaleDateString();
		expect(isWithinNDays(localeDateStr, 1)).toBe(true);
	});
});
