import type {
	ArticleDetail,
	ArticleDetailResponse,
	ArticleInfo,
	ArticleInfoResponse,
} from "../types/articleTypes";

export function articleInfoTransform(
	articleInfoResponse: ArticleInfoResponse
): ArticleInfo {
	return {
		id: articleInfoResponse.id,
		title: articleInfoResponse.title,
		datePublished: new Date(
			articleInfoResponse.date_published
		).toLocaleDateString(),
		mainCategory: articleInfoResponse.main_category,
		viewed: articleInfoResponse.viewed,
	};
}

export function articleDetailTransform(
	articleDetailResponse: ArticleDetailResponse
): ArticleDetail {
	return {
		id: articleDetailResponse.id,
		paragraphs: articleDetailResponse.paragraphs,
		subCategory: articleDetailResponse.sub_category,
		source: articleDetailResponse.source,
		url: articleDetailResponse.url,
	};
}
