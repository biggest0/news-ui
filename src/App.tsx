import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import HomePage from "@/pages/HomePage";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { LoadingOverlay } from "@/components/common/feedback/LoadingOverlay";
import ScrollToTop from "@/components/layout/navigation/ScrollToTop";
import { ARTICLE_ROUTES } from "@/constants/routes";
import { AppSettingProvider } from "@/contexts/AppSettingContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Route-level code-splitting (M8): the home page stays in the main bundle
// (it's the LCP-critical landing route); every other page loads on demand.
const ArticlePages = lazy(() => import("@/pages/ArticlesPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const SubCategoryPage = lazy(() => import("@/pages/SubCategoryPage"));
const About = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/ContactPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));
const DisclaimerPage = lazy(() => import("@/pages/DisclaimerPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const GoogleCallbackPage = lazy(() => import("@/pages/GoogleCallbackPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const NewPasswordPage = lazy(() => import("@/pages/NewPasswordPage"));
const EmailVerificationPage = lazy(() => import("@/pages/EmailVerificationPage"));
const ArticlePage = lazy(() => import("@/pages/ArticlePage"));

function App() {
	const { t } = useTranslation();
	return (
		<BrowserRouter basename="/">
			<AppSettingProvider>
				<AuthProvider>
					<Header />
					{/* Language toggles update content in place (M5): RTK Query args
					    carry `lang`, so hooks refetch automatically — no page remount,
					    scroll position preserved */}
					<main className="w-full max-w-[1280px] min-h-screen mx-auto px-4 bg-background transition-colors duration-200">
						<ScrollToTop />
						<Suspense fallback={<LoadingOverlay loading />}>
							<Routes>
								<Route path="/" element={<HomePage />} />
								{/* Article category pages */}
								{ARTICLE_ROUTES.map((category) => (
									<Route
										key={category}
										path={`/${category}`}
										element={<ArticlePages />}
									/>
								))}
								{/* Article pages */}
								<Route path="/article/:id" element={<ArticlePage />} />
								<Route path="/subcategory/:subCategory" element={<SubCategoryPage />} />
								<Route path="/search" element={<SearchPage />} />
								<Route path="/about" element={<About />} />
								<Route path="/contact" element={<Contact />} />
								<Route path="/account" element={<AccountPage />} />
								<Route path="/login" element={<LoginPage />} />
								<Route path="/register" element={<RegisterPage />} />
								<Route path="/account/verification" element={<EmailVerificationPage />} />
								<Route path="/reset-password" element={<ResetPasswordPage />} />
								<Route path="/reset-password/:token" element={<NewPasswordPage />} />
								<Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
								<Route path="/blog" element={<BlogPage />} />
								<Route path="/blog/:slug" element={<BlogPostPage />} />
								<Route path="/disclaimer" element={<DisclaimerPage />} />
								{/* Other routes */}
								<Route path="*" element={<div>{t("APP.NOT_FOUND")}</div>} />
							</Routes>
						</Suspense>
					</main>
					<Footer />
				</AuthProvider>
			</AppSettingProvider>
		</BrowserRouter>
	);
}

export default App;
