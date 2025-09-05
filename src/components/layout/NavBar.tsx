// components/NavBar.tsx
import { User, Cat, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function NavBar() {
	return (
		<nav className="w-full z-20 py-3 flex items-center justify-between">
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
			<div className="text-5xl font-semibold text-gray-800 tracking-wide">
				THE CATIRE TIMES
			</div>

			{/* Right - Icons */}
			<div className="flex gap-4 items-center text-gray-600">
				<Search className="w-5 h-5 hover:text-black cursor-pointer" />
				<User className="w-5 h-5 hover:text-black cursor-pointer" />
			</div>
		</nav>
	);
}
