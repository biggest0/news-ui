import {
	createSlice,
	createAsyncThunk,
	current,
	isAnyOf,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { ArticleInfo, ArticleDetail } from "../types/articleTypes";
import {
	fetchArticleDetail,
	fetchArticlesByCategory,
	fetchArticlesInfo,
} from "../api/articleApi";

interface ArticleRequest {
	articles: ArticleInfo[];
	loading: boolean;
	error: string | undefined;
}

interface ArticlesState {
	articles: ArticleInfo[];
	articlesDetail: Record<string, ArticleDetail>;
	loading: boolean;
	error: string | undefined;
}

const initialState: ArticlesState = {
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

export const getArticlesInfo = createAsyncThunk<ArticleInfo[]>(
	"articles/getArticlesInfo",
	async () => {
		return fetchArticlesInfo();
	}
);

export const getArticleDetail = createAsyncThunk<ArticleDetail, string>(
	"articles/getArticleDetail",
	async (articleId: string) => {
		return fetchArticleDetail(articleId);
	}
);

export const getArticlesInfoByCategory = createAsyncThunk<
	ArticleInfo[],
	string
>("articles/getArticlesInfoByCategory", async (category: string) => {
	return fetchArticlesByCategory(category);
});

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
		// fetch article details with article ID
		builder
			.addCase(getArticleDetail.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(getArticleDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.articlesDetail[action.payload.id] = action.payload;
			})
			.addCase(getArticleDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});

		// fetch for basic article info
		builder
			.addMatcher(
				isAnyOf(getArticlesInfo.pending, getArticlesInfoByCategory.pending),
				(state) => {
					state.loading = true;
					state.error = undefined;
				}
			)
			.addMatcher(
				isAnyOf(getArticlesInfo.fulfilled, getArticlesInfoByCategory.fulfilled),
				(state, action) => {
					state.loading = false;
					action.payload.forEach((article) => {
						console.log("ran");
						const exists = state.articles.some((a) => a.id === article.id);
						if (!exists) {
							state.articles.push(article);
						}
					});
				}
			)
			.addMatcher(
				isAnyOf(getArticlesInfo.rejected, getArticlesInfoByCategory.rejected),
				(state, action) => {
					state.loading = false;
					state.error = action.error.message;
				}
			);
	},
});

export default articlesSlice.reducer;
