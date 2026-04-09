export interface ArticleInfoDTO {
	_id: string;
	title: string;
	summary?: string;
	date_published: string;
	main_category: string;
	sub_category?: string[];
	viewed: number;
	like_count: number;
}

export interface ArticleLikeStatusDTO {
	liked: boolean;
	like_count: number;
}

export interface ArticleHistoryItemDTO {
	_id: string;
	title: string;
	summary?: string;
	date_published: string;
	main_category: string;
	sub_category?: string[];
	viewed: number;
	like_count: number;
	read_at: string;
}

export interface ArticleHistoryResponseDTO {
	articles: ArticleHistoryItemDTO[];
	count: number;
}

export interface ArticleDetailDTO {
	_id: string;
	date_published: string;
	title: string;
	summary?: string;
	paragraphs: string[];
	main_category: string;
	sub_category: string[];
	source: string;
	url: string;
}

export interface ArticleInfoQueryDTO {
	page?: number;
	limit?: number;
	category?: string;
	search?: string;
	dateRange?: string;
	sortBy?: string;
}

export interface ArticleInfoResponseDTO {
	articles: ArticleInfoDTO[];
	count: number;
}

export interface RecommendedArticleDTO {
	_id: string;
	title: string;
	summary?: string;
	main_category: string;
	sub_category?: string[];
	date_published: string;
	score: number;
}

export interface RecommendedArticlesResponseDTO {
	articles: RecommendedArticleDTO[];
}