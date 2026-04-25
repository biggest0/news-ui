import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RecommendedArticle } from "@/types/articleTypes";
import type { RootState } from "@/store/store";
import {
	getSimilarArticles,
	getRecommendedArticles,
} from "@/service/articleService";

interface RecommendationsState {
	similar: Record<string, RecommendedArticle[]>;
	recommended: RecommendedArticle[];
	loading: {
		similar: boolean;
		recommended: boolean;
	};
	error: {
		similar: string | undefined;
		recommended: string | undefined;
	};
}

const initialState: RecommendationsState = {
	similar: {},
	recommended: [],
	loading: {
		similar: false,
		recommended: false,
	},
	error: {
		similar: undefined,
		recommended: undefined,
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
	},
});

export const { clearRecommendedArticles } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
