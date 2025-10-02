import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import HomePage from "@/pages/HomePage";
import ArticlePages from "@/pages/ArticlesPage";
import SearchPage from "./pages/SearchPage";
import About from "./pages/About";
import Contact from "./pages/Conatct";

import NoticeBar from "@/components/common/NoticeBar";
import NavBar from "@/components/navBar/NavBar";
import Footer from "@/components/layout/Footer";
import CategoryBar from "@/components/layout/CategoryBar";
import ArticlePage from "./pages/ArticlePage";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { ARTICLE_ROUTES } from "@/constants/routes";

function App() {
	return (
		<BrowserRouter basename="/">
			<main className="w-full max-w-[1280px] min-h-screen mx-auto px-4">
				<ScrollToTop />
				<NoticeBar />
				<NavBar />
				<CategoryBar />
				<Routes>
					<Route path="/" element={<HomePage />} />
					{/* article category pages */}
					{ARTICLE_ROUTES.map((category) => (
						<Route
							key={category}
							path={`/${category}`}
							element={<ArticlePages />}
						/>
					))}
					{/* article pages */}
					<Route path="/article/:id" element={<ArticlePage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/about" element={<About />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="*" element={<div>Page not Found</div>} />
				</Routes>
			</main>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
