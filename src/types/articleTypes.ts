export interface ArticleResponse {
	articles: ArticleInfo[];
	count: number;
}

export interface ArticleInfo {
	id: string;
	title: string;
	summary?: string;
	datePublished: string | undefined;
	mainCategory: string | undefined;
	viewed: number;
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
