/**
 * Shared test helper that wraps components in the provider tree required by
 * the card components: Redux store, React Router, i18next, and AuthContext.
 *
 * Usage:
 *   renderWithProviders(<MyComponent />, { accessToken: "tok", preloadedState: { ... } });
 *
 * The AuthContext is mocked directly (no real AuthProvider) so tests can
 * control `accessToken` and `isAuthenticated` without touching localStorage.
 */
import { render, type RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { createContext, useContext, type ReactNode } from "react";
import type { RootState } from "@/store/store";
import articlesReducer from "@/store/articlesSlice";

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
				},
			},
		},
	},
	interpolation: { escapeValue: false },
});

// ── Mock AuthContext (avoids importing the real provider) ─────────────

interface MockAuthValues {
	accessToken: string | null;
	isAuthenticated: boolean;
}

const MockAuthContext = createContext<MockAuthValues & {
	user: null;
	isLoading: false;
	login: () => Promise<void>;
	register: () => Promise<void>;
	logout: () => Promise<void>;
}>({
	user: null,
	accessToken: null,
	isAuthenticated: false,
	isLoading: false,
	login: async () => {},
	register: async () => {},
	logout: async () => {},
});

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
		reducer: { article: articlesReducer },
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
