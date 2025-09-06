import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import NoticeBar from "@/components/common/NoticeBar";
import HomePage from "@/pages/HomePage";
import ArticlePage from "@/pages/ArticlesPage";
import SearchPage from "./pages/SearchPage";
import { ARTICLE_ROUTES } from "@/constants/routes";
import CategoryBar from "@/components/layout/CategoryBar";

function App() {
	return (
		<BrowserRouter>
			<main className="w-full max-w-[1280px] min-h-screen mx-auto">
				<NoticeBar />
				<NavBar />
				<CategoryBar />
				<Routes>
					<Route path="/" element={<HomePage />} />
					{ARTICLE_ROUTES.map((category) => (
						<Route
							key={category}
							path={`/${category}`}
							element={<ArticlePage />}
						/>
					))}
					<Route path="/search" element={<SearchPage />} />
					<Route path="*" element={<div>Page not Found</div>} />
				</Routes>
			</main>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
