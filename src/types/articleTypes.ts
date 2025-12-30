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
