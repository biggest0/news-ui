/**
 * Shared test helper that wraps components in the provider tree required by
 * the card components: Redux store, React Router, i18next, and AuthContext.
 *
 * Usage:
 *   renderWithProviders(<MyComponent />, { preloadedState: { ... } });
 *
 * The AuthContext is mocked directly (no real AuthProvider) so tests can
 * control `isAuthenticated` without touching localStorage or cookies.
 */
import { render, type RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { type ReactNode } from "react";
import type { RootState } from "@/store/store";
import { apiSlice } from "@/store/api/apiSlice";

// ── Minimal i18n instance for tests ──────────────────────────────────

const testI18n = i18n.createInstance();
testI18n.init({
	lng: "en",
	resources: {
		en: {
			translation: {
				ARTICLE_CARD: {
					READ_MORE: "Read More",
					HIDE: "Hide",
					SHARE: "Share",
					LOADING_DETAILS: "Loading details...",
					LOGIN_TO_LIKE: "Log in to like this article",
				},
				COMMON: {
					COPIED: "Copied",
					SHARE: "Share",
					LOAD: "Loading",
					LOADING: "Loading...",
					LOAD_ERROR: "Couldn't load this section.",
					RETRY: "Try again",
				},
				SECTION: {
					MEWS: "Mews",
					EDITORS: "Editors",
					POPULAR: "Popular",
					STAFF_PICKS: "Staff Picks",
					CAT_FACTS: "Cat Facts",
				},
				FILTER: {
					DATE_RANGE: "Date Range",
					ANY_TIME: "Any Time",
					LAST_24_HOURS: "Last 24 Hours",
					LAST_7_DAYS: "Last 7 Days",
					LAST_30_DAYS: "Last 30 Days",
					SORT_BY: "Sort By",
					NEWEST: "Newest",
					MOST_VIEWED: "Most Viewed",
				},
				PAGINATION: {
					SHOW: "Show",
					PER_PAGE: "per page",
					PAGE: "Page",
					OF: "of",
					FIRST_PAGE: "First page",
					PREVIOUS_PAGE: "Previous page",
					NEXT_PAGE: "Next page",
					LAST_PAGE: "Last page",
					ARTICLES_COMING: "Just a few seconds, articles are coming!",
					CAUGHT_UP: "You've scrolled to the end. There's nothing left!",
				},
				EMPTY_STATE: {
					NEWS_SECTION_MESSAGE: "Looks like you removed the Mews section",
					BRING_BACK_BUTTON: "Bring It Back",
					ALL_SECTIONS_MESSAGE: "Looks like you removed every section",
					RESET_TO_DEFAULT: "Reset To Default",
				},
				DROPDOWN: {
					COLLAPSE: "Collapse",
					EXPAND: "Expand",
					REMOVE: "Remove",
					SCROLL_VIEW: "Scroll View",
					PAGE_VIEW: "Page View",
					RESTORE_SECTIONS: "Restore hidden sections",
				},
				LANGUAGE: {
					EN: "English",
					FR: "French",
				},
				THEME: {
					LIGHT: "Light",
					DARK: "Dark",
					SYSTEM: "System",
					SWITCH_TO: "Switch to {{mode}} mode",
				},
				ONBOARDING: {
					TITLE: "How to use this site",
					STEP_OF: "Step {{current}} of {{total}}",
					SKIP: "Skip tour",
					BACK: "Back",
					NEXT: "Next",
					FINISH: "Got it",
					REOPEN: "How to use this site",
					DOT_LABEL: "Go to step {{step}}",
					WELCOME: {
						TITLE: "Welcome to Catire Time",
						BODY: "Every story here is satire.",
						DISCLAIMER_LINK: "Read the full disclaimer",
					},
					PREFERENCES: {
						TITLE: "Make it yours",
						BODY: "Read in English or French.",
						LANGUAGE_LABEL: "Language",
						THEME_LABEL: "Appearance",
					},
					READING: {
						TITLE: "Choose how you read",
						BODY: "Endless feed or numbered pages.",
						SCROLL: "Endless scroll",
						PAGES: "Numbered pages",
					},
					SECTIONS: {
						TITLE: "Arrange the home page",
						BODY: "Sections can be collapsed or removed.",
						RESET: "Reset home layout",
					},
					BROWSE: {
						TITLE: "Find what you like",
						BODY: "Browse by category or search.",
					},
					ACCOUNT: {
						TITLE: "Make it personal",
						BODY: "Create an account for likes and history.",
						CTA: "Create an account",
					},
				},
			},
		},
	},
	interpolation: { escapeValue: false },
});

// ── Mock AuthContext (avoids importing the real provider) ─────────────

interface MockAuthValues {
	isAuthenticated: boolean;
}

/**
 * A mock version of the useAuth hook.
 * vi.mock("@/contexts/AuthContext") in each test file redirects useAuth here.
 */
export const mockUseAuth = (values: MockAuthValues) => () => ({
	user: null,
	isLoading: false,
	login: async () => {},
	register: async () => {},
	logout: async () => {},
	...values,
});

// ── Provider options ─────────────────────────────────────────────────

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
	preloadedState?: Partial<RootState>;
	route?: string;
}

/**
 * Renders a component wrapped in Redux Provider, MemoryRouter, and I18nextProvider.
 *
 * NOTE: AuthContext is NOT wrapped here — each test file mocks `useAuth` via
 * `vi.mock("@/contexts/AuthContext")` instead, giving full control per test.
 */
export function renderWithProviders(
	ui: React.ReactElement,
	{
		preloadedState = {},
		route = "/",
		...renderOptions
	}: ExtendedRenderOptions = {}
) {
	const store = configureStore({
		reducer: {
			[apiSlice.reducerPath]: apiSlice.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(apiSlice.middleware),
		preloadedState: preloadedState as RootState,
	});

	function Wrapper({ children }: { children: ReactNode }) {
		return (
			<Provider store={store}>
				<MemoryRouter initialEntries={[route]}>
					<I18nextProvider i18n={testI18n}>
						{children}
					</I18nextProvider>
				</MemoryRouter>
			</Provider>
		);
	}

	return {
		store,
		...render(ui, { wrapper: Wrapper, ...renderOptions }),
	};
}
