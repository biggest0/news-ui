import { describe, it, expect } from "vitest";
import { validateEmail, cleanseEmail } from "@/utils/validation/textUtils";

// ── validateEmail ────────────────────────────────────────────────────

describe("validateEmail", () => {
	it("accepts a standard email", () => {
		expect(validateEmail("user@example.com")).toBe(true);
	});

	it("accepts email with subdomain", () => {
		expect(validateEmail("user@mail.example.com")).toBe(true);
	});

	it("accepts email with dots in local part", () => {
		expect(validateEmail("first.last@example.com")).toBe(true);
	});

	it("accepts email with plus in local part", () => {
		expect(validateEmail("user+tag@example.com")).toBe(true);
	});

	it("rejects email without @", () => {
		expect(validateEmail("userexample.com")).toBe(false);
	});

	it("rejects email without domain", () => {
		expect(validateEmail("user@")).toBe(false);
	});

	it("rejects email without TLD", () => {
		expect(validateEmail("user@example")).toBe(false);
	});

	it("rejects email with spaces", () => {
		expect(validateEmail("user @example.com")).toBe(false);
	});

	it("rejects empty string", () => {
		expect(validateEmail("")).toBe(false);
	});

	it("rejects email with multiple @ signs", () => {
		expect(validateEmail("user@@example.com")).toBe(false);
	});

	it("rejects email with space in domain", () => {
		expect(validateEmail("user@exam ple.com")).toBe(false);
	});
});

// ── cleanseEmail ─────────────────────────────────────────────────────

describe("cleanseEmail", () => {
	it("lowercases the email", () => {
		expect(cleanseEmail("User@Example.COM")).toBe("user@example.com");
	});

	it("trims leading and trailing whitespace", () => {
		expect(cleanseEmail("  user@example.com  ")).toBe("user@example.com");
	});

	it("trims and lowercases combined", () => {
		expect(cleanseEmail("  USER@EXAMPLE.COM  ")).toBe("user@example.com");
	});

	it("handles empty string", () => {
		expect(cleanseEmail("")).toBe("");
	});

	it("handles string that is only whitespace", () => {
		expect(cleanseEmail("   ")).toBe("");
	});

	it("handles already clean email", () => {
		expect(cleanseEmail("user@example.com")).toBe("user@example.com");
	});
});
