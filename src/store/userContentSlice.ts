import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
	ArticleHistoryItem,
	ArticleLikeStatus,
} from "@/types/articleTypes";
import {
	toggleArticleLike,
	getArticleLikeStatus,
	getArticleHistory,
	clearArticleHistory,
	removeArticleFromHistory,
} from "@/service/userArticleService";

interface UserContentState {
	likes: Record<string, ArticleLikeStatus>;
	history: {
		articles: ArticleHistoryItem[];
		count: number;
	};
	loading: {
		likeStatus: boolean;
		likeToggle: boolean;
		history: boolean;
		historyMutation: boolean;
	};
	error: {
		like: string | undefined;
		history: string | undefined;
	};
}

const initialState: UserContentState = {
	likes: {},
	history: { articles: [], count: 0 },
	loading: {
		likeStatus: false,
		likeToggle: false,
		history: false,
		historyMutation: false,
	},
	error: {
		like: undefined,
		history: undefined,
	},
};

// -------------------------
// Likes thunks
// -------------------------
export const loadArticleLikeStatus = createAsyncThunk<
	{ articleId: string; status: ArticleLikeStatus },
	{ articleId: string }
>("userContent/loadLikeStatus", async ({ articleId }) => {
	const status = await getArticleLikeStatus(articleId);
	return { articleId, status };
});

export const toggleArticleLikeThunk = createAsyncThunk<
	{ articleId: string; status: ArticleLikeStatus },
	{ articleId: string }
>("userContent/toggleLike", async ({ articleId }) => {
	const status = await toggleArticleLike(articleId);
	return { articleId, status };
});

// -------------------------
// History thunks
// -------------------------
export const loadArticleHistory = createAsyncThunk<
	{ articles: ArticleHistoryItem[]; count: number },
	{ page?: number; limit?: number }
>("userContent/loadHistory", async ({ page, limit }) => {
	return await getArticleHistory(page, limit);
});

export const clearArticleHistoryThunk = createAsyncThunk<void, void>(
	"userContent/clearHistory",
	async () => {
		await clearArticleHistory();
	}
);

export const removeArticleFromHistoryThunk = createAsyncThunk<
	string,
	{ articleId: string }
>("userContent/removeHistoryItem", async ({ articleId }) => {
	await removeArticleFromHistory(articleId);
	return articleId;
});

// -------------------------
// Slice
// -------------------------
const userContentSlice = createSlice({
	name: "userContent",
	initialState,
	reducers: {
		/** Clears all user content (e.g. on logout). */
		clearUserContent: (state) => {
			state.likes = {};
			state.history = { articles: [], count: 0 };
			state.error = { like: undefined, history: undefined };
		},
	},
	extraReducers: (builder) => {
		// Like status
		builder
			.addCase(loadArticleLikeStatus.pending, (state) => {
				state.loading.likeStatus = true;
				state.error.like = undefined;
			})
			.addCase(loadArticleLikeStatus.fulfilled, (state, action) => {
				state.loading.likeStatus = false;
				state.likes[action.payload.articleId] = action.payload.status;
			})
			.addCase(loadArticleLikeStatus.rejected, (state, action) => {
				state.loading.likeStatus = false;
				state.error.like = action.error.message;
			});

		// Toggle like
		builder
			.addCase(toggleArticleLikeThunk.pending, (state) => {
				state.loading.likeToggle = true;
				state.error.like = undefined;
			})
			.addCase(toggleArticleLikeThunk.fulfilled, (state, action) => {
				state.loading.likeToggle = false;
				state.likes[action.payload.articleId] = action.payload.status;
			})
			.addCase(toggleArticleLikeThunk.rejected, (state, action) => {
				state.loading.likeToggle = false;
				state.error.like = action.error.message;
			});

		// History
		builder
			.addCase(loadArticleHistory.pending, (state) => {
				state.loading.history = true;
				state.error.history = undefined;
			})
			.addCase(loadArticleHistory.fulfilled, (state, action) => {
				state.loading.history = false;
				state.history = action.payload;
			})
			.addCase(loadArticleHistory.rejected, (state, action) => {
				state.loading.history = false;
				state.error.history = action.error.message;
			});

		// Clear history
		builder
			.addCase(clearArticleHistoryThunk.pending, (state) => {
				state.loading.historyMutation = true;
				state.error.history = undefined;
			})
			.addCase(clearArticleHistoryThunk.fulfilled, (state) => {
				state.loading.historyMutation = false;
				state.history = { articles: [], count: 0 };
			})
			.addCase(clearArticleHistoryThunk.rejected, (state, action) => {
				state.loading.historyMutation = false;
				state.error.history = action.error.message;
			});

		// Remove history item
		builder
			.addCase(removeArticleFromHistoryThunk.pending, (state) => {
				state.loading.historyMutation = true;
				state.error.history = undefined;
			})
			.addCase(removeArticleFromHistoryThunk.fulfilled, (state, action) => {
				state.loading.historyMutation = false;
				state.history.articles = state.history.articles.filter(
					(article) => article.id !== action.payload
				);
				state.history.count = Math.max(0, state.history.count - 1);
			})
			.addCase(removeArticleFromHistoryThunk.rejected, (state, action) => {
				state.loading.historyMutation = false;
				state.error.history = action.error.message;
			});
	},
});

export const { clearUserContent } = userContentSlice.actions;
export default userContentSlice.reducer;
