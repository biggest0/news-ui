import type { ArticleDetail, ArticleInfo } from "@/types/articleTypes";
import type { ArticleDetailDTO, ArticleInfoDTO } from "@/types/articleDto";

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
		viewed: articleInfoResponse.viewed,
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
