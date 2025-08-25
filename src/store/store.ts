import { configureStore } from "@reduxjs/toolkit";
import articlesReducer from "./articlesSlice";

export const store = configureStore({
	reducer: {
		article: articlesReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
