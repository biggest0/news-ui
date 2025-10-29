import CatLoading from "@/assets/cat_loading.gif";
import { useEffect, useState } from "react";

export const LoadingOverlay = ({ loading }: { loading: boolean }) => {
	const [show, setShow] = useState(loading);

	// Handle fade-out effect
	useEffect(() => {
		if (loading) setShow(true);
		else {
			const timer = setTimeout(() => setShow(false), 300); // match the transition duration
			return () => clearTimeout(timer);
		}
	}, [loading]);
	return (
		show && (
			<div
				className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-gray-700 transition-opacity duration-300 ${
					loading ? "opacity-100" : "opacity-0"
				}`}
			>
				<img src={CatLoading} alt="Loading" className="w-32 h-32" />
				<div>Loading...</div>
			</div>
		)
	);
};
