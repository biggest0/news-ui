import {
	createSlice,
	createAsyncThunk,
	current,
	isAnyOf,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { ArticleInfo, ArticleDetail } from "../types/articleTypes";
import {
	getArticleDetail,
	getArticlesByCategory,
	getArticlesInfo,
	getTopTenArticles,
} from "../service/articleService";

interface ArticleRequest {
	articles: ArticleInfo[];
	loading: boolean;
	error: string | undefined;
}

interface ArticlesState {
	topTenArticles: ArticleInfo[];
	articles: ArticleInfo[];
	articlesDetail: Record<string, ArticleDetail>;
	loading: boolean;
	error: string | undefined;
}

const initialState: ArticlesState = {
	topTenArticles: [],
	articles: [],
	articlesDetail: {},
	loading: false,
	error: undefined,
};

// export const getArticlesInfo = createAsyncThunk<ArticleInfo[]>(
// 	"articles/getArticlesInfo",
// 	async () => {
// 		const response = await fetch("http://localhost:3001/article-info?page=1&limit=10", {
// 			method: "GET",
// 			headers: { "Content-Type": "application/json" },
// 		});
// 		if (!response.ok) {
// 			throw new Error(`Error: ${response.statusText}`);
// 		}
// 		const data = await response.json();
//     return data.map(articleInfoTransform)
// 	}
// );

// export const getArticleDetail = createAsyncThunk<ArticleDetail, string>(
// 	"articles/getArticleDetail",
// 	async (articleId) => {
// 		const response = await fetch("http://localhost:3001/article-detail", {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify({ id: articleId }),
// 		});
// 		if (!response.ok) {
// 			throw new Error(`Error: ${response.statusText}`);
// 		}
//     const data = await response.json()
//     return articleDetailTransform(data)
// 	}
// );

export const loadArticlesInfo = createAsyncThunk<ArticleInfo[]>(
	"articles/getArticlesInfo",
	async () => {
		return getArticlesInfo();
	}
);

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
			state.articles.filter((article) => article.id !== action.payload);
		},
		clearError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		// load article details with article ID
		builder
			.addCase(loadArticleDetail.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(loadArticleDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.articlesDetail[action.payload.id] = action.payload;
			})
			.addCase(loadArticleDetail.rejected, (state, action) => {
				state.loading = false;
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

		// fetch for basic article info
		builder
			.addMatcher(
				isAnyOf(loadArticlesInfo.pending, loadArticlesInfoByCategory.pending),
				(state) => {
					state.loading = true;
					state.error = undefined;
				}
			)
			.addMatcher(
				isAnyOf(
					loadArticlesInfo.fulfilled,
					loadArticlesInfoByCategory.fulfilled
				),
				(state, action) => {
					state.loading = false;
					action.payload.forEach((article) => {
						const exists = state.articles.some((a) => a.id === article.id);
						if (!exists) {
							state.articles.push(article);
						}
					});
				}
			)
			.addMatcher(
				isAnyOf(loadArticlesInfo.rejected, loadArticlesInfoByCategory.rejected),
				(state, action) => {
					state.loading = false;
					state.error = action.error.message;
				}
			);
	},
});

export default articlesSlice.reducer;
