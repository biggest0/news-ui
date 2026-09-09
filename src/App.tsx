import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import HomePage from "@/pages/HomePage";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { LoadingOverlay } from "@/components/common/feedback/LoadingOverlay";
import ScrollToTop from "@/components/layout/navigation/ScrollToTop";
import {
	ARTICLE_ROUTES,
	PAGE_ROUTES,
	ROUTE_PATTERNS,
	categoryPath,
} from "@/constants/routes";
import { AppSettingProvider } from "@/contexts/AppSettingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import OnboardingTourMount from "@/components/onboarding/OnboardingTourMount";

// Route-level code-splitting (M8): the home page stays in the main bundle
// (it's the LCP-critical landing route); every other page loads on demand.
const ArticlePages = lazy(() => import("@/pages/ArticlesPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const SubCategoryPage = lazy(() => import("@/pages/SubCategoryPage"));
const About = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/ContactPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));
const DisclaimerPage = lazy(() => import("@/pages/DisclaimerPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const GoogleCallbackPage = lazy(() => import("@/pages/GoogleCallbackPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const NewPasswordPage = lazy(() => import("@/pages/NewPasswordPage"));
const EmailVerificationPage = lazy(() => import("@/pages/EmailVerificationPage"));
const ArticlePage = lazy(() => import("@/pages/ArticlePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function App() {
	return (
		<BrowserRouter basename="/">
			<AppSettingProvider>
				<AuthProvider>
					{/* Onboarding open-state is shared above <main>: the mobile menu
					    (inside Header) and the About page both open the tour, and the
					    dialog itself is mounted once at this level. */}
					<OnboardingProvider>
						<Header />
						{/* Language toggles update content in place (M5): RTK Query args
						    carry `lang`, so hooks refetch automatically — no page remount,
						    scroll position preserved */}
						<main className="w-full max-w-[1280px] min-h-screen mx-auto px-4 bg-background transition-colors duration-200">
							<ScrollToTop />
							<Suspense fallback={<LoadingOverlay loading />}>
								<Routes>
									<Route path={PAGE_ROUTES.HOME} element={<HomePage />} />
									{/* Article category pages */}
									{ARTICLE_ROUTES.map((category) => (
										<Route
											key={category}
											path={categoryPath(category)}
											element={<ArticlePages />}
										/>
									))}
									{/* Article pages */}
									<Route path={ROUTE_PATTERNS.ARTICLE} element={<ArticlePage />} />
									<Route path={ROUTE_PATTERNS.SUBCATEGORY} element={<SubCategoryPage />} />
									<Route path={PAGE_ROUTES.SEARCH} element={<SearchPage />} />
									<Route path={PAGE_ROUTES.ABOUT} element={<About />} />
									<Route path={PAGE_ROUTES.CONTACT} element={<Contact />} />
									<Route path={PAGE_ROUTES.ACCOUNT} element={<AccountPage />} />
									<Route path={PAGE_ROUTES.LOGIN} element={<LoginPage />} />
									<Route path={PAGE_ROUTES.REGISTER} element={<RegisterPage />} />
									<Route path={PAGE_ROUTES.VERIFY_EMAIL} element={<EmailVerificationPage />} />
									<Route path={PAGE_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
									<Route path={ROUTE_PATTERNS.NEW_PASSWORD} element={<NewPasswordPage />} />
									<Route path={PAGE_ROUTES.GOOGLE_CALLBACK} element={<GoogleCallbackPage />} />
									<Route path={PAGE_ROUTES.BLOG} element={<BlogPage />} />
									<Route path={ROUTE_PATTERNS.BLOG_POST} element={<BlogPostPage />} />
									<Route path={PAGE_ROUTES.DISCLAIMER} element={<DisclaimerPage />} />
									<Route path={PAGE_ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
									{/* Other routes */}
									<Route path="*" element={<NotFoundPage />} />
								</Routes>
							</Suspense>
						</main>
						<Footer />
						{/* Lazy: the chunk is only fetched once the tour is first opened */}
						<OnboardingTourMount />
					</OnboardingProvider>
				</AuthProvider>
			</AppSettingProvider>
		</BrowserRouter>
	);
}

export default App;
