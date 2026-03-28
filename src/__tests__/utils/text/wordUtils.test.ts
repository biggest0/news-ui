import { describe, it, expect } from "vitest";
import { capitalizeWord } from "@/utils/text/wordUtils";

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
