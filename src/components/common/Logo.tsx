import { Link } from "react-router-dom";
import { LuCat } from "react-icons/lu";

interface LogoProps {
	size?: "sm" | "md" | "lg";
}

export const Logo = ({ size = "md" }: LogoProps) => {
	const sizeClasses = {
		sm: "w-5 h-5",
		md: "w-6 h-6",
		lg: "w-8 h-8",
	};

	return (
		<Link to="/">
			<LuCat
				className={`${sizeClasses[size]} hover:text-black cursor-pointer`}
			/>
		</Link>
	);
};
