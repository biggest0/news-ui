import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "@/index.css";
import App from "@/App.tsx";
import { store } from "@/store/store.ts";
import i18n from "@/i18n/config.ts";
import { resetArticleData } from "@/store/articlesSlice";
import { resetRecommendations } from "@/store/recommendationsSlice";
import { clearUserContent } from "@/store/userContentSlice";
import { resetCatFacts } from "@/store/catFactsSlice";

// Keep document + article data in sync with the UI language.
// All cached article content is language-specific, so on toggle we clear the
// store and let the remounted pages (see key on <main> in App.tsx) refetch
// with the new `lang` query param.
i18n.on("languageChanged", (lng) => {
	document.documentElement.lang = lng;
	store.dispatch(resetArticleData());
	store.dispatch(resetRecommendations());
	store.dispatch(clearUserContent());
	store.dispatch(resetCatFacts());
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
