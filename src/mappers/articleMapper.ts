import type { ArticleDetail, ArticleHistoryItem, ArticleInfo, RecommendedArticle } from "@/types/articleTypes";
import type { ArticleDetailDTO, ArticleHistoryItemDTO, ArticleInfoDTO, RecommendedArticleDTO } from "@/types/articleDto";
import { formatArticleDate } from "@/i18n/lang";

export function mapDTOtoArticleInfo(
	articleInfoResponse: ArticleInfoDTO
): ArticleInfo {
	return {
		id: articleInfoResponse._id,
		title: articleInfoResponse.title,
		summary: articleInfoResponse.summary,
		datePublished: formatArticleDate(articleInfoResponse.date_published),
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
		datePublished: formatArticleDate(dto.date_published),
		mainCategory: dto.main_category,
		subCategory: dto.sub_category || [],
		viewed: dto.viewed,
		likeCount: dto.like_count ?? 0,
		readAt: formatArticleDate(dto.read_at),
	};
}

export function mapDTOtoRecommendedArticle(
	dto: RecommendedArticleDTO
): RecommendedArticle {
	return {
		id: dto._id,
		title: dto.title,
		summary: dto.summary,
		mainCategory: dto.main_category,
		subCategory: dto.sub_category || [],
		datePublished: formatArticleDate(dto.date_published),
		score: dto.score,
	};
}

export function mapDTOtoArticleDetail(
	articleDetailResponse: ArticleDetailDTO
): ArticleDetail {
	return {
		id: articleDetailResponse._id,
		datePublished: formatArticleDate(articleDetailResponse.date_published),
		title: articleDetailResponse.title,
		summary: articleDetailResponse.summary,
		paragraphs: articleDetailResponse.paragraphs,
		mainCategory: articleDetailResponse.main_category,
		subCategory: articleDetailResponse.sub_category,
		source: articleDetailResponse.source,
		url: articleDetailResponse.url,
	};
}
