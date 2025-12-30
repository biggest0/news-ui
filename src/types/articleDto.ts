export interface ArticleInfoDTO {
	_id: string;
	title: string;
	summary?: string;
	date_published: string;
	main_category: string;
	viewed: number;
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

export interface ArticleInfoQueryDto {
	page?: number;
	limit?: number;
	category?: string;
	search?: string;
	dateRange?: string;
	sortBy?: string;
}