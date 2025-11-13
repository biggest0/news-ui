import { Link } from "react-router-dom";
import { LuHouse } from "react-icons/lu";

interface LogoProps {
	size?: "sm" | "md";
}

export const AppLogo = ({ size = "md" }: LogoProps) => {
	const sizeClasses = {
		sm: "w-5 h-5",
		md: "w-6 h-6",
	};

	return (
		<Link to="/">
			<LuHouse
				className={`${sizeClasses[size]} hover:text-black cursor-pointer`}
			/>
		</Link>
		// To DO: Replace with actual logo image (maybe)
		// <a href="">
		// 	<img src="test-logo.png" alt="" className={`${sizeClasses[size]} hover:text-black cursor-pointer`}/>
		// </a>
	);
};
