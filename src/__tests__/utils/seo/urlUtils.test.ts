/**
 * canonicalPath / absoluteUrl / assetUrl: the one place that decides what a
 * canonical URL looks like (trailing slash, no query, absolute origin).
 */
import { describe, it, expect } from "vitest";
import { absoluteUrl, assetUrl, canonicalPath } from "@/utils/seo/urlUtils";

describe("canonicalPath", () => {
	it("keeps the home page as a bare slash", () => {
		expect(canonicalPath("/")).toBe("/");
		expect(canonicalPath("")).toBe("/");
	});

	it("adds exactly one trailing slash", () => {
		expect(canonicalPath("/about")).toBe("/about/");
		expect(canonicalPath("/about/")).toBe("/about/");
		expect(canonicalPath("/about//")).toBe("/about/");
	});

	it("adds a missing leading slash", () => {
		expect(canonicalPath("about")).toBe("/about/");
	});

	it("drops query strings and hashes", () => {
		expect(canonicalPath("/search?q=cats&sortBy=newest")).toBe("/search/");
		expect(canonicalPath("/about#mission")).toBe("/about/");
	});

	it("preserves encoded segments", () => {
		expect(canonicalPath("/subcategory/space%20travel")).toBe("/subcategory/space%20travel/");
		expect(canonicalPath("/article/0ca44d28-1e3a")).toBe("/article/0ca44d28-1e3a/");
	});
});

describe("absoluteUrl", () => {
	it("prefixes the production origin", () => {
		expect(absoluteUrl("/about")).toBe("https://www.catiretime.com/about/");
		expect(absoluteUrl("/")).toBe("https://www.catiretime.com/");
	});
});

describe("assetUrl", () => {
	it("points at a public file without a trailing slash", () => {
		expect(assetUrl("/og-image.jpg")).toBe("https://www.catiretime.com/og-image.jpg");
		expect(assetUrl("og-image.jpg")).toBe("https://www.catiretime.com/og-image.jpg");
	});
});
