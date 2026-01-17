import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { ArticleInfo, ArticleDetail, ArticleResponse } from "@/types/articleTypes";
import type { ArticleInfoQueryDTO } from "@/types/articleDto";
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
	homeArticlesCount: number;
	articles: ArticleInfo[];
	articlesCount: number;
	articlesDetail: Record<string, ArticleDetail>;
	loading: {
		homePage: boolean;
		topTen: boolean;
		articles: boolean;
		detail: boolean;
	};
	error: {
		homePage: string | undefined;
		topTen: string | undefined;
		articles: string | undefined;
		detail: string | undefined;
	};
}

const initialState: ArticlesState = {
	topTenArticles: [],
	homeArticles: [],
	homeArticlesCount: 0,
	articles: [],
	articlesCount: 0,
	articlesDetail: {},
	loading: {
		homePage: false,
		topTen: false,
		articles: false,
		detail: false,
	},
	error: {
		homePage: undefined,
		topTen: undefined,
		articles: undefined,
		detail: undefined,
	},
};

// -------------------------
// Thunks for async actions
// -------------------------
export const loadInitialArticlesInfo = createAsyncThunk<
	ArticleResponse,
	ArticleInfoQueryDTO
>("articles/loadInitialArticlesInfo", async (request) => {
	return getArticlesInfo(request);
});

export const loadArticlesInfo = createAsyncThunk<
	ArticleResponse,
	ArticleInfoQueryDTO
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
	ArticleResponse,
	{ page: number; category: string }
>("articles/getArticlesInfoByCategory", async ({ page, category }) => {
	return getArticlesByCategory(page, category);
});

export const loadArticlesInfoBySearch = createAsyncThunk<
	ArticleResponse,
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

// -------------------------
// Helper functions
// -------------------------
// re-enable when hasMore flag has been implemented
// const appendUniqueArticles = (
// 	existingArticles: ArticleInfo[],
// 	newArticles: ArticleInfo[]
// ) => {
// 	const articlesMap = new Map(existingArticles.map((a) => [a.id, a]));
// 	newArticles.forEach((article) => {
// 		if (!articlesMap.has(article.id)) {
// 			articlesMap.set(article.id, article);
// 		}
// 	});
// 	return Array.from(articlesMap.values());
// };

// -------------------------
// Articles Slice
// -------------------------
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
			state.articles = state.articles.filter(
				(article) => article.id !== action.payload
			);
		},
		clearError: (state) => {
			state.error = {
				homePage: undefined,
				topTen: undefined,
				articles: undefined,
				detail: undefined,
			};
		},
	},
	extraReducers: (builder) => {
		// load initial articles for home page
		builder
			.addCase(loadInitialArticlesInfo.pending, (state) => {
				state.loading.homePage = true;
				state.error.homePage = undefined;
			})
			.addCase(loadInitialArticlesInfo.fulfilled, (state, action) => {
				state.loading.homePage = false;
				state.homeArticles = action.payload.articles;
				state.homeArticlesCount = action.payload.count;
			})
			.addCase(loadInitialArticlesInfo.rejected, (state, action) => {
				state.loading.homePage = false;
				state.error.homePage = action.error.message;
			});

		// load article details with article ID
		builder
			.addCase(loadArticleDetail.pending, (state) => {
				state.loading.detail = true;
				state.error.detail = undefined;
			})
			.addCase(loadArticleDetail.fulfilled, (state, action) => {
				state.loading.detail = false;
				state.articlesDetail[action.payload.id] = action.payload;
			})
			.addCase(loadArticleDetail.rejected, (state, action) => {
				state.loading.detail = false;
				state.error.detail = action.error.message;
			});

		// load top 10 articles
		builder
			.addCase(loadTopTenArticles.pending, (state) => {
				state.loading.topTen = true;
				state.error.topTen = undefined;
			})
			.addCase(loadTopTenArticles.fulfilled, (state, action) => {
				state.loading.topTen = false;
				state.topTenArticles = action.payload;
			})
			.addCase(loadTopTenArticles.rejected, (state, action) => {
				state.loading.topTen = false;
				state.error.topTen = action.error.message;
			});

		// paginate articles for home page
		builder
			.addCase(loadArticlesInfo.pending, (state) => {
				state.loading.articles = true;
				state.error.articles = undefined;
			})
			.addCase(loadArticlesInfo.fulfilled, (state, action) => {
				state.loading.articles = false;
				state.homeArticlesCount = action.payload.count;

				action.payload.articles.forEach((article) => {
					const exists = state.homeArticles.some((a) => a.id === article.id);
					if (!exists) {
						state.homeArticles.push(article);
					}
				});

				// state.homeArticles = appendUniqueArticles(state.homeArticles, action.payload.articles)
			})
			.addCase(loadArticlesInfo.rejected, (state, action) => {
				state.loading.articles = false;
				state.error.articles = action.error.message;
			});

		// fetch for basic article info
		builder
			.addMatcher(
				isAnyOf(
					loadArticlesInfoByCategory.pending,
					loadArticlesInfoBySearch.pending
				),
				(state) => {
					state.loading.articles = true;
					state.error.articles = undefined;
				}
			)
			.addMatcher(
				isAnyOf(
					loadArticlesInfoByCategory.fulfilled,
					loadArticlesInfoBySearch.fulfilled
				),
				(state, action) => {
					state.loading.articles = false;
					state.articlesCount = action.payload.count;

					action.payload.articles.forEach((article) => {
						const exists = state.articles.some((a) => a.id === article.id);
						if (!exists) {
							state.articles.push(article);
						}
					});

					// state.articles = appendUniqueArticles(state.articles, action.payload.articles)
				}
			)
			.addMatcher(
				isAnyOf(
					loadArticlesInfoByCategory.rejected,
					loadArticlesInfoBySearch.rejected
				),
				(state, action) => {
					state.loading.articles = false;
					state.error.articles = action.error.message;
				}
			);
	},
});

export default articlesSlice.reducer;
