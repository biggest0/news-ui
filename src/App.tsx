import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import HomePage from "@/pages/HomePage";
import ArticlePages from "@/pages/ArticlesPage";
import SearchPage from "./pages/SearchPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import About from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import AccountPage from "./pages/AccountPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NewPasswordPage from "./pages/NewPasswordPage";

import Header from "./components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import ArticlePage from "./pages/ArticlePage";
import ScrollToTop from "@/components/layout/navigation/ScrollToTop";
import { ARTICLE_ROUTES } from "@/constants/routes";
import { AppSettingProvider } from "./contexts/AppSettingContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
	return (
		<BrowserRouter basename="/">
			<AppSettingProvider>
				<AuthProvider>
					<Header />
					<main className="w-full max-w-[1280px] min-h-screen mx-auto px-4 bg-surface transition-colors duration-200">
						<ScrollToTop />
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
							<Route path="/reset-password" element={<ResetPasswordPage />} />
							<Route path="/reset-password/:token" element={<NewPasswordPage />} />
							<Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
							<Route path="/blog" element={<BlogPage />} />
							<Route path="/blog/:slug" element={<BlogPostPage />} />
							<Route path="/disclaimer" element={<DisclaimerPage />} />
							{/* Other routes */}
							<Route path="*" element={<div>Page not Found</div>} />
						</Routes>
					</main>
					<Footer />
				</AuthProvider>
			</AppSettingProvider>
		</BrowserRouter>
	);
}

export default App;
