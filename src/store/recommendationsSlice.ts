import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RecommendedArticle } from "@/types/articleTypes";
import type { RootState } from "@/store/store";
import {
	getSimilarArticles,
	getRecommendedArticles,
	getSemanticSearchResults,
} from "@/service/articleService";

interface SemanticSearchParams {
	q: string;
	page?: number;
	dateRange?: string;
	sortBy?: string;
}

interface RecommendationsState {
	similar: Record<string, RecommendedArticle[]>;
	recommended: RecommendedArticle[];
	semanticSearch: {
		articles: RecommendedArticle[];
		count: number;
	};
	loading: {
		similar: boolean;
		recommended: boolean;
		semanticSearch: boolean;
	};
	error: {
		similar: string | undefined;
		recommended: string | undefined;
		semanticSearch: string | undefined;
	};
}

const initialState: RecommendationsState = {
	similar: {},
	recommended: [],
	semanticSearch: {
		articles: [],
		count: 0,
	},
	loading: {
		similar: false,
		recommended: false,
		semanticSearch: false,
	},
	error: {
		similar: undefined,
		recommended: undefined,
		semanticSearch: undefined,
	},
};

// -------------------------
// Thunks
// -------------------------
export const loadSimilarArticles = createAsyncThunk<
	{ articleId: string; articles: RecommendedArticle[] },
	string
>("recommendations/loadSimilar", async (articleId, { getState }) => {
	const state = getState() as RootState;
	if (state.recommendations.similar[articleId]) {
		return { articleId, articles: state.recommendations.similar[articleId] };
	}
	const articles = await getSimilarArticles(articleId);
	return { articleId, articles };
});

export const loadRecommendedArticles = createAsyncThunk<
	RecommendedArticle[],
	string
>("recommendations/loadRecommended", async (accessToken) => {
	return await getRecommendedArticles(accessToken);
});

export const loadSemanticSearchResults = createAsyncThunk<
	{ articles: RecommendedArticle[]; count: number; page: number },
	SemanticSearchParams
>("recommendations/loadSemanticSearch", async ({ q, page = 1, dateRange, sortBy }) => {
	const result = await getSemanticSearchResults({ q, page, dateRange, sortBy });
	return { ...result, page };
});

// -------------------------
// Slice
// -------------------------
const recommendationsSlice = createSlice({
	name: "recommendations",
	initialState,
	reducers: {
		clearRecommendedArticles: (state) => {
			state.recommended = [];
		},
		clearSemanticSearch: (state) => {
			state.semanticSearch = { articles: [], count: 0 };
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadSimilarArticles.pending, (state) => {
				state.loading.similar = true;
				state.error.similar = undefined;
			})
			.addCase(loadSimilarArticles.fulfilled, (state, action) => {
				state.loading.similar = false;
				state.similar[action.payload.articleId] = action.payload.articles;
			})
			.addCase(loadSimilarArticles.rejected, (state, action) => {
				state.loading.similar = false;
				state.error.similar = action.error.message;
			});

		builder
			.addCase(loadRecommendedArticles.pending, (state) => {
				state.loading.recommended = true;
				state.error.recommended = undefined;
			})
			.addCase(loadRecommendedArticles.fulfilled, (state, action) => {
				state.loading.recommended = false;
				state.recommended = action.payload;
			})
			.addCase(loadRecommendedArticles.rejected, (state, action) => {
				state.loading.recommended = false;
				state.error.recommended = action.error.message;
			});

		builder
			.addCase(loadSemanticSearchResults.pending, (state) => {
				state.loading.semanticSearch = true;
				state.error.semanticSearch = undefined;
			})
			.addCase(loadSemanticSearchResults.fulfilled, (state, action) => {
				state.loading.semanticSearch = false;
				if (action.payload.page === 1) {
					state.semanticSearch.articles = action.payload.articles;
				} else {
					state.semanticSearch.articles.push(...action.payload.articles);
				}
				state.semanticSearch.count = action.payload.count;
			})
			.addCase(loadSemanticSearchResults.rejected, (state, action) => {
				state.loading.semanticSearch = false;
				state.error.semanticSearch = action.error.message;
			});
	},
});

export const { clearRecommendedArticles, clearSemanticSearch } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
