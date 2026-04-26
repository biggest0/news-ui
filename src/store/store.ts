import { configureStore } from "@reduxjs/toolkit";
import articlesReducer from "./articlesSlice";
import recommendationsReducer from "./recommendationsSlice";
import userContentReducer from "./userContentSlice";

export const store = configureStore({
	reducer: {
		article: articlesReducer,
		recommendations: recommendationsReducer,
		userContent: userContentReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
