// components/NavBar.tsx
import { useState } from "react";
import { User, Cat, Search, X } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { loadArticlesInfoBySearch } from "@/store/articlesSlice";

export default function NavBar() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const [searchClicked, setSearchClicked] = useState(false);
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			dispatch(loadArticlesInfoBySearch({ page: 1, search: query }));
			navigate(`/search?q=${encodeURIComponent(query)}`);
			setSearchClicked(false);
		}
	};

	return (
		<nav className="w-full z-20 py-3 flex items-center justify-between relative">
			{/* Left - Logo */}
			{/* <Link
				className="text-xl font-bold text-blue-600"
				to={{
					pathname: "/",
				}}
			>
				📰
			</Link> */}
			<Link
				to={{
					pathname: "/",
				}}
			>
				<Cat className="w-5 h-5 hover:text-black cursor-pointer" />
			</Link>

			{/* Center - App Name */}
			<div className="absolute left-1/2 transform -translate-x-1/2 lg:text-5xl font-semibold text-gray-800 tracking-wide">
				THE CATIRE TIMES
			</div>

			{/* Right - Icons */}
			<div className="flex gap-4 items-center text-gray-600">
				<div className="relative flex items-center">
					{/* Search icon */}
					{!searchClicked && (
						<Search
							className={`w-5 h-5 cursor-pointer transition-colors duration-200 ${
								searchClicked ? "text-blue-500" : "hover:text-black"
							}`}
							onClick={() => setSearchClicked(true)}
						/>
					)}

					{/* Expanding search bar */}
					<form
						onSubmit={handleSubmit}
						className={`flex items-center border overflow-hidden bg-white transition-all duration-300 ease-in-out
							${searchClicked ? "w-64 px-2 opacity-100" : "w-0 px-0 opacity-0"}
						`}
					>
						{/* Search icon */}
						<button type="submit">
							<Search className="w-4 h-4 text-gray-400 cursor-pointer hover:text-black  flex-shrink-0" />
						</button>

						{/* Input */}
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search..."
							className="min-w-0 flex-1 px-2 py-1 outline-none text-gray-700 placeholder-gray-400"
						/>

						{/* Close button */}
						<X
							className="w-4 h-4 text-gray-400 cursor-pointer hover:text-black flex-shrink-0"
							onClick={() => {
								setSearchClicked(false);
								setQuery("");
							}}
						/>
					</form>
				</div>
				<User className="w-5 h-5 hover:text-black cursor-pointer" />
			</div>
		</nav>
	);
}
