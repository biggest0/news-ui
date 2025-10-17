export interface ArticleInfoResponse {
	_id: string;
	title: string;
	summary?: string;
	date_published: string;
	main_category: string;
	viewed: number;
}

export interface ArticleInfo {
	id: string;
	title: string;
	summary?: string;
	datePublished: string | undefined;
	mainCategory: string | undefined;
	viewed: number;
}

export interface ArticleInfoRequest {
	page?: number;
	limit?: number;
	category?: string;
	search?: string;
	dateRange?: string;
	sortBy?: string;
}

export interface ArticleDetail {
	id: string;
	datePublished: string;
	title: string;
	summary?: string;
	paragraphs: string[];
	mainCategory: string;
	subCategory: string[];
	source: string;
	url: string;
}

export interface ArticleDetailResponse {
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
