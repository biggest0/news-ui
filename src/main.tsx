import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "@/index.css";
import App from "@/App.tsx";
import { store } from "@/store/store.ts";
import i18n from "@/i18n/config.ts";
import { apiSlice } from "@/store/api/apiSlice";
import { authStore } from "@/auth/authStore";

// Keep the document language in sync with the UI language. Article data
// needs no manual handling: RTK Query endpoints carry `lang` in their cache
// keys, so every migrated domain refetches automatically on toggle (M5 —
// this replaced the manual slice resets + <main key> page remount).
i18n.on("languageChanged", (lng) => {
	document.documentElement.lang = lng;
});

// Drop per-user cached data (likes, reading history) the moment the session
// ends, so a subsequent login as a different user can't see stale entries.
// (Subscribed here rather than in authStore to avoid a runtime import cycle:
// authStore ← apiSlice ← store.)
let wasAuthenticated = authStore.getState().isAuthenticated;
authStore.subscribe(() => {
	const { isAuthenticated } = authStore.getState();
	if (wasAuthenticated && !isAuthenticated) {
		store.dispatch(apiSlice.util.invalidateTags(["Like", "History"]));
	}
	wasAuthenticated = isAuthenticated;
});
// i18n init (and its initial languageChanged event) ran on import above,
// so set the initial <html lang> explicitly
document.documentElement.lang = i18n.resolvedLanguage ?? "en";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>
);
