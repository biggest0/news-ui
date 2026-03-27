import type { ArticleDetail, ArticleHistoryItem, ArticleInfo } from "@/types/articleTypes";
import type { ArticleDetailDTO, ArticleHistoryItemDTO, ArticleInfoDTO } from "@/types/articleDto";

export function mapDTOtoArticleInfo(
	articleInfoResponse: ArticleInfoDTO
): ArticleInfo {
	return {
		id: articleInfoResponse._id,
		title: articleInfoResponse.title,
		summary: articleInfoResponse.summary,
		datePublished: new Date(
			articleInfoResponse.date_published
		).toLocaleDateString(),
		mainCategory: articleInfoResponse.main_category,
		subCategory: articleInfoResponse.sub_category || [],
		viewed: articleInfoResponse.viewed,
		likeCount: articleInfoResponse.like_count ?? 0,
	};
}

export function mapDTOtoArticleHistoryItem(
	dto: ArticleHistoryItemDTO
): ArticleHistoryItem {
	return {
		id: dto._id,
		title: dto.title,
		summary: dto.summary,
		datePublished: new Date(dto.date_published).toLocaleDateString(),
		mainCategory: dto.main_category,
		subCategory: dto.sub_category || [],
		viewed: dto.viewed,
		likeCount: dto.like_count ?? 0,
		readAt: new Date(dto.read_at).toLocaleDateString(),
	};
}

export function mapDTOtoArticleDetail(
	articleDetailResponse: ArticleDetailDTO
): ArticleDetail {
	return {
		id: articleDetailResponse._id,
		datePublished: new Date(
			articleDetailResponse.date_published
		).toLocaleDateString(),
		title: articleDetailResponse.title,
		summary: articleDetailResponse.summary,
		paragraphs: articleDetailResponse.paragraphs,
		mainCategory: articleDetailResponse.main_category,
		subCategory: articleDetailResponse.sub_category,
		source: articleDetailResponse.source,
		url: articleDetailResponse.url,
	};
}
