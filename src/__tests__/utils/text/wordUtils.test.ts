import { describe, it, expect } from "vitest";
import { capitalizeWord, truncateText } from "@/utils/text/wordUtils";

describe("capitalizeWord", () => {
	it("capitalizes the first letter of a lowercase word", () => {
		expect(capitalizeWord("hello")).toBe("Hello");
	});

	it("keeps an already-capitalized word unchanged", () => {
		expect(capitalizeWord("Hello")).toBe("Hello");
	});

	it("capitalizes single character", () => {
		expect(capitalizeWord("a")).toBe("A");
	});

	it("returns empty string for empty input", () => {
		expect(capitalizeWord("")).toBe("");
	});

	it("returns empty string for undefined input", () => {
		expect(capitalizeWord(undefined)).toBe("");
	});

	it("handles all-uppercase string — only first char stays, rest unchanged", () => {
		expect(capitalizeWord("HELLO")).toBe("HELLO");
	});

	it("handles string with leading space", () => {
		expect(capitalizeWord(" hello")).toBe(" hello");
	});

	it("handles string with numbers", () => {
		expect(capitalizeWord("123abc")).toBe("123abc");
	});

	it("handles string with special characters", () => {
		expect(capitalizeWord("@hello")).toBe("@hello");
	});

	it("handles multi-word string — only first character changes", () => {
		expect(capitalizeWord("hello world")).toBe("Hello world");
	});
});

describe("truncateText", () => {
	it("returns short text unchanged", () => {
		expect(truncateText("Short and sweet.", 155)).toBe("Short and sweet.");
	});

	it("cuts at a word boundary and appends an ellipsis", () => {
		const text = "A founder advises taking five breaths before answering a question.";
		const result = truncateText(text, 40);
		expect(result.length).toBeLessThanOrEqual(40);
		expect(result.endsWith("…")).toBe(true);
		expect(result).toBe("A founder advises taking five breaths…");
	});

	it("falls back to a hard cut when there is no usable space", () => {
		expect(truncateText("a".repeat(200), 20)).toBe(`${"a".repeat(19)}…`);
	});
});
