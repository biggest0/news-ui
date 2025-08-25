import "./App.css";

import HomePageNotice from "./components/HomePageNotice";
import NewsSection from "./components/NewsSection";

function App() {
	return (
		<>
			<HomePageNotice></HomePageNotice>
			<div className="w-full max-w-[1280px] min-h-screen mx-auto">
				<NewsSection />
			</div>
		</>
	);
}

export default App;
