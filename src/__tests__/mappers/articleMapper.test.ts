import { describe, it, expect } from "vitest";
import {
	mapDTOtoArticleInfo,
	mapDTOtoArticleHistoryItem,
	mapDTOtoArticleDetail,
} from "@/mappers/articleMapper";
import type { ArticleInfoDTO, ArticleHistoryItemDTO, ArticleDetailDTO } from "@/types/articleDto";

// ── Helpers ──────────────────────────────────────────────────────────

function makeArticleInfoDTO(overrides: Partial<ArticleInfoDTO> = {}): ArticleInfoDTO {
	return {
		_id: "abc123",
		title: "Cat Parliament",
		summary: "A tabby named Lord Whiskers took over",
		date_published: "2026-03-20T00:00:00.000Z",
		main_category: "politics",
		sub_category: ["government", "cats"],
		viewed: 1234,
		like_count: 42,
		...overrides,
	};
}

function makeHistoryItemDTO(overrides: Partial<ArticleHistoryItemDTO> = {}): ArticleHistoryItemDTO {
	return {
		...makeArticleInfoDTO(),
		read_at: "2026-03-24T14:30:00.000Z",
		...overrides,
	};
}

function makeArticleDetailDTO(overrides: Partial<ArticleDetailDTO> = {}): ArticleDetailDTO {
	return {
		_id: "detail999",
		date_published: "2026-01-15T12:00:00.000Z",
		title: "Deep Dive: Cat Economy",
		summary: "An in-depth look at the feline economy",
		paragraphs: ["Paragraph one.", "Paragraph two."],
		main_category: "business",
		sub_category: ["economy", "cats"],
		source: "Catire Press",
		url: "https://example.com/article/detail999",
		...overrides,
	};
}

// ── mapDTOtoArticleInfo ──────────────────────────────────────────────

describe("mapDTOtoArticleInfo", () => {
	it("maps all fields from DTO to domain type", () => {
		const dto = makeArticleInfoDTO();
		const result = mapDTOtoArticleInfo(dto);

		expect(result.id).toBe("abc123");
		expect(result.title).toBe("Cat Parliament");
		expect(result.summary).toBe("A tabby named Lord Whiskers took over");
		expect(result.mainCategory).toBe("politics");
		expect(result.subCategory).toEqual(["government", "cats"]);
		expect(result.viewed).toBe(1234);
		expect(result.likeCount).toBe(42);
	});

	it("converts date_published to localized date string", () => {
		const dto = makeArticleInfoDTO({ date_published: "2026-03-20T00:00:00.000Z" });
		const result = mapDTOtoArticleInfo(dto);
		// Should be a non-empty date string (locale-dependent format)
		expect(result.datePublished).toBeTruthy();
		expect(typeof result.datePublished).toBe("string");
	});

	it("defaults likeCount to 0 when like_count is undefined", () => {
		const dto = makeArticleInfoDTO();
		// Simulate backend not returning like_count
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (dto as any).like_count;
		const result = mapDTOtoArticleInfo(dto);
		expect(result.likeCount).toBe(0);
	});

	it("defaults likeCount to 0 when like_count is null", () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dto = makeArticleInfoDTO({ like_count: null as any });
		const result = mapDTOtoArticleInfo(dto);
		expect(result.likeCount).toBe(0);
	});

	it("defaults sub_category to empty array when undefined", () => {
		const dto = makeArticleInfoDTO({ sub_category: undefined });
		const result = mapDTOtoArticleInfo(dto);
		expect(result.subCategory).toEqual([]);
	});

	it("preserves like_count of 0", () => {
		const dto = makeArticleInfoDTO({ like_count: 0 });
		const result = mapDTOtoArticleInfo(dto);
		expect(result.likeCount).toBe(0);
	});

	it("handles summary being undefined", () => {
		const dto = makeArticleInfoDTO({ summary: undefined });
		const result = mapDTOtoArticleInfo(dto);
		expect(result.summary).toBeUndefined();
	});

	it("handles an invalid date string gracefully", () => {
		const dto = makeArticleInfoDTO({ date_published: "not-a-date" });
		const result = mapDTOtoArticleInfo(dto);
		// new Date("not-a-date").toLocaleDateString() → "Invalid Date"
		expect(result.datePublished).toBe("Invalid Date");
	});
});

// ── mapDTOtoArticleHistoryItem ───────────────────────────────────────

describe("mapDTOtoArticleHistoryItem", () => {
	it("maps all fields including readAt", () => {
		const dto = makeHistoryItemDTO();
		const result = mapDTOtoArticleHistoryItem(dto);

		expect(result.id).toBe("abc123");
		expect(result.title).toBe("Cat Parliament");
		expect(result.readAt).toBeTruthy();
		expect(typeof result.readAt).toBe("string");
	});

	it("converts read_at to localized date string", () => {
		const dto = makeHistoryItemDTO({ read_at: "2026-03-24T14:30:00.000Z" });
		const result = mapDTOtoArticleHistoryItem(dto);
		expect(result.readAt).toBeTruthy();
		expect(result.readAt).not.toBe("Invalid Date");
	});

	it("defaults likeCount to 0 when like_count missing", () => {
		const dto = makeHistoryItemDTO();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (dto as any).like_count;
		const result = mapDTOtoArticleHistoryItem(dto);
		expect(result.likeCount).toBe(0);
	});

	it("defaults sub_category to empty array when undefined", () => {
		const dto = makeHistoryItemDTO({ sub_category: undefined });
		const result = mapDTOtoArticleHistoryItem(dto);
		expect(result.subCategory).toEqual([]);
	});

	it("handles invalid read_at date", () => {
		const dto = makeHistoryItemDTO({ read_at: "garbage" });
		const result = mapDTOtoArticleHistoryItem(dto);
		expect(result.readAt).toBe("Invalid Date");
	});
});

// ── mapDTOtoArticleDetail ────────────────────────────────────────────

describe("mapDTOtoArticleDetail", () => {
	it("maps all detail fields correctly", () => {
		const dto = makeArticleDetailDTO();
		const result = mapDTOtoArticleDetail(dto);

		expect(result.id).toBe("detail999");
		expect(result.title).toBe("Deep Dive: Cat Economy");
		expect(result.summary).toBe("An in-depth look at the feline economy");
		expect(result.paragraphs).toEqual(["Paragraph one.", "Paragraph two."]);
		expect(result.mainCategory).toBe("business");
		expect(result.subCategory).toEqual(["economy", "cats"]);
		expect(result.source).toBe("Catire Press");
		expect(result.url).toBe("https://example.com/article/detail999");
	});

	it("converts date_published to localized date string", () => {
		const dto = makeArticleDetailDTO();
		const result = mapDTOtoArticleDetail(dto);
		expect(result.datePublished).toBeTruthy();
		expect(result.datePublished).not.toBe("Invalid Date");
	});

	it("handles empty paragraphs array", () => {
		const dto = makeArticleDetailDTO({ paragraphs: [] });
		const result = mapDTOtoArticleDetail(dto);
		expect(result.paragraphs).toEqual([]);
	});

	it("handles undefined summary", () => {
		const dto = makeArticleDetailDTO({ summary: undefined });
		const result = mapDTOtoArticleDetail(dto);
		expect(result.summary).toBeUndefined();
	});

	it("handles invalid date_published", () => {
		const dto = makeArticleDetailDTO({ date_published: "nope" });
		const result = mapDTOtoArticleDetail(dto);
		expect(result.datePublished).toBe("Invalid Date");
	});
});
