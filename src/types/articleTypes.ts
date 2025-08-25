export interface ArticleInfoResponse {
	id: string;
	title: string;
	date_published: string;
	main_category: string;
	viewed: number;
}

export interface ArticleInfo {
	id: string;
	title: string;
	datePublished: string | undefined;
	mainCategory: string | undefined;
	viewed: number;
}

export interface ArticleDetail {
	id: string;
	paragraphs: string[];
	subCategory: string[];
	source: string;
	url: string;
}

export interface ArticleDetailResponse {
	id: string;
	paragraphs: string[];
	sub_category: string[];
	source: string;
	url: string;
}
