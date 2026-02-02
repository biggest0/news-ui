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

import Header from "./components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import ArticlePage from "./pages/ArticlePage";
import ScrollToTop from "@/components/layout/navigation/ScrollToTop";
import { ARTICLE_ROUTES } from "@/constants/routes";
import { AppSettingProvider } from "./contexts/AppSettingContext";

function App() {
	return (
		<BrowserRouter basename="/">
			<AppSettingProvider>
				<Header />
				<main className="w-full max-w-[1280px] min-h-screen mx-auto px-4">
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
						<Route path="/disclaimer" element={<DisclaimerPage />} />
						{/* Other routes */}
						<Route path="*" element={<div>Page not Found</div>} />
					</Routes>
				</main>
				<Footer />
			</AppSettingProvider>
		</BrowserRouter>
	);
}

export default App;
