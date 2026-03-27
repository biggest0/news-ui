export interface ArticleResponse {
	articles: ArticleInfo[];
	count: number;
}

export interface ArticleInfo {
	id: string;
	title: string;
	summary?: string;
	datePublished: string;
	mainCategory: string | undefined;
	subCategory: string[];
	viewed: number;
	likeCount: number;
}

export interface ArticleLikeStatus {
	liked: boolean;
	likeCount: number;
}

export interface ArticleHistoryItem {
	id: string;
	title: string;
	summary?: string;
	datePublished: string;
	mainCategory: string | undefined;
	subCategory: string[];
	viewed: number;
	likeCount: number;
	readAt: string;
}

export interface ArticleHistoryResponse {
	articles: ArticleHistoryItem[];
	count: number;
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
