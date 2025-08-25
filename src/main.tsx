import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<NavBar></NavBar>
		<Provider store={store}>
			<App />
		</Provider>
		<Footer></Footer>
	</StrictMode>
);
