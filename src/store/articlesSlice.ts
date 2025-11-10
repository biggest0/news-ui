import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
	ArticleInfo,
	ArticleDetail,
	ArticleInfoRequest,
} from "@/types/articleTypes";
import {
	getArticleDetail,
	getArticlesByCategory,
	getArticlesBySearch,
	getArticlesInfo,
	getTopTenArticles,
} from "@/service/articleService";

interface ArticlesState {
	topTenArticles: ArticleInfo[];
	homeArticles: ArticleInfo[];
	articles: ArticleInfo[];
	articlesDetail: Record<string, ArticleDetail>;
	loadingPage: boolean;
	loadingArticleInfo: boolean;
	loadingArticleDetail: boolean;
	error: string | undefined;
}

const initialState: ArticlesState = {
	topTenArticles: [],
	homeArticles: [],
	articles: [],
	articlesDetail: {},
	loadingPage: false,
	loadingArticleInfo: false,
	loadingArticleDetail: false,
	error: undefined,
};

export const loadInitialArticlesInfo = createAsyncThunk<
	ArticleInfo[],
	ArticleInfoRequest
>("articles/loadInitialArticlesInfo", async (request) => {
	return getArticlesInfo(request);
});

export const loadArticlesInfo = createAsyncThunk<
	ArticleInfo[],
	ArticleInfoRequest
>("articles/getArticlesInfo", async (request) => {
	return getArticlesInfo(request);
});

export const loadArticleDetail = createAsyncThunk<ArticleDetail, string>(
	"articles/getArticleDetail",
	async (articleId: string) => {
		return getArticleDetail(articleId);
	}
);

export const loadArticlesInfoByCategory = createAsyncThunk<
	ArticleInfo[],
	{ page: number; category: string }
>("articles/getArticlesInfoByCategory", async ({ page, category }) => {
	return getArticlesByCategory(page, category);
});

export const loadArticlesInfoBySearch = createAsyncThunk<
	ArticleInfo[],
	{ page: number; search: string }
>("articles/getArticlesInfoBySearch", async ({ page, search }) => {
	return getArticlesBySearch(page, search);
});

export const loadTopTenArticles = createAsyncThunk<ArticleInfo[]>(
	"articles/getTopTenArticles",
	async () => {
		return getTopTenArticles();
	}
);

const articlesSlice = createSlice({
	name: "articles",
	initialState,
	reducers: {
		setArticles: (state, action: PayloadAction<ArticleInfo[]>) => {
			state.articles = action.payload;
		},
		addArticle: (state, action: PayloadAction<ArticleInfo>) => {
			state.articles.push(action.payload);
		},
		updateArticle: (
			state,
			action: PayloadAction<{ id: string; updates: Partial<ArticleInfo> }>
		) => {
			const article = state.articles.find(
				(article) => article.id === action.payload.id
			);
			if (article) {
				Object.assign(article, action.payload.updates);
			}
		},
		removeArticle: (state, action: PayloadAction<string>) => {
			state.articles = state.articles.filter((article) => article.id !== action.payload);
		},
		clearError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		// load initial articles for home page
		builder
			.addCase(loadInitialArticlesInfo.pending, (state) => {
				state.loadingPage = true;
				state.error = undefined;
			})
			.addCase(loadInitialArticlesInfo.fulfilled, (state, action) => {
				state.loadingPage = false;
				state.homeArticles = action.payload;
			})
			.addCase(loadInitialArticlesInfo.rejected, (state, action) => {
				state.loadingPage = false;
				state.error = action.error.message;
			});

		// load article details with article ID
		builder
			.addCase(loadArticleDetail.pending, (state) => {
				state.loadingArticleDetail = true;
				state.error = undefined;
			})
			.addCase(loadArticleDetail.fulfilled, (state, action) => {
				state.loadingArticleDetail = false;
				state.articlesDetail[action.payload.id] = action.payload;
			})
			.addCase(loadArticleDetail.rejected, (state, action) => {
				state.loadingArticleDetail = false;
				state.error = action.error.message;
			});

		// load top 10 articles
		builder
			.addCase(loadTopTenArticles.pending, (state) => {
				state.error = undefined;
			})
			.addCase(loadTopTenArticles.fulfilled, (state, action) => {
				state.topTenArticles = action.payload;
			})
			.addCase(loadTopTenArticles.rejected, (state, action) => {
				state.error = action.error.message;
			});

		// paginate articles for home page
		builder
			.addCase(loadArticlesInfo.pending, (state) => {
				state.loadingArticleInfo = true;
				state.error = undefined;
			})
			.addCase(loadArticlesInfo.fulfilled, (state, action) => {
				state.loadingArticleInfo = false;

				action.payload.forEach((article) => {
					const exists = state.homeArticles.some((a) => a.id === article.id);
					if (!exists) {
						state.homeArticles.push(article);
					}
				});
			})
			.addCase(loadArticlesInfo.rejected, (state, action) => {
				state.loadingArticleInfo = false;
				state.error = action.error.message;
			});

		// fetch for basic article info
		builder
			.addMatcher(
				isAnyOf(
					loadArticlesInfoByCategory.pending,
					loadArticlesInfoBySearch.pending
				),
				(state) => {
					state.loadingArticleInfo = true;
					state.error = undefined;
				}
			)
			.addMatcher(
				isAnyOf(
					loadArticlesInfoByCategory.fulfilled,
					loadArticlesInfoBySearch.fulfilled
				),
				(state, action) => {
					state.loadingArticleInfo = false;
					action.payload.forEach((article) => {
						const exists = state.articles.some((a) => a.id === article.id);
						if (!exists) {
							state.articles.push(article);
						}
					});
				}
			)
			.addMatcher(
				isAnyOf(
					loadArticlesInfoByCategory.rejected,
					loadArticlesInfoBySearch.rejected
				),
				(state, action) => {
					state.loadingArticleInfo = false;
					state.error = action.error.message;
				}
			);
	},
});

export default articlesSlice.reducer;
