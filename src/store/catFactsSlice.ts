import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { CatFact } from "@/types/catFactTypes";
import type { RootState } from "@/store/store";
import { getCatFacts } from "@/service/catFactService";

interface CatFactsState {
	facts: CatFact[];
	loading: boolean;
	error: string | undefined;
}

const initialState: CatFactsState = {
	facts: [],
	loading: false,
	error: undefined,
};

// -------------------------
// Thunks
// -------------------------
/**
 * Loads the server-decided cat facts (localized to the active language).
 * Desktop and mobile cat-facts sections both dispatch this on mount, so the
 * `condition` skips the call when the data is already loaded or in flight.
 */
export const loadCatFacts = createAsyncThunk<CatFact[]>(
	"catFacts/loadCatFacts",
	async () => {
		return getCatFacts();
	},
	{
		condition: (_, { getState }) => {
			const { facts, loading } = (getState() as RootState).catFacts;
			return facts.length === 0 && !loading;
		},
	}
);

// -------------------------
// Slice
// -------------------------
const catFactsSlice = createSlice({
	name: "catFacts",
	initialState,
	reducers: {
		/**
		 * Resets cat facts to their initial state.
		 * Dispatched when the UI language changes so facts are refetched
		 * in the new language.
		 */
		resetCatFacts: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadCatFacts.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(loadCatFacts.fulfilled, (state, action) => {
				state.loading = false;
				state.facts = action.payload;
			})
			.addCase(loadCatFacts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export const { resetCatFacts } = catFactsSlice.actions;
export default catFactsSlice.reducer;
