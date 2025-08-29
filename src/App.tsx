import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePageNotice from "./components/HomePageNotice";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlesPage";
import { ARTICLE_ROUTES } from "./constants/routes";
import CategoryBar from "./components/CategoryBar";

function App() {
	return (
		<BrowserRouter>
			<NavBar />
			<CategoryBar />
			<HomePageNotice />
			<main className="w-full max-w-[1280px] min-h-screen mx-auto">
				<Routes>
					<Route path="/" element={<HomePage />} />
					{ARTICLE_ROUTES.map((category) => (
						<Route
							key={category}
							path={`/${category}`}
							element={<ArticlePage />}
						/>
					))}
					{/* <Route> path='*' element={<div>Page not Found</div>}</Route> */}
					<Route path="*" element={<div>Page not Found</div>} />
				</Routes>
			</main>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
