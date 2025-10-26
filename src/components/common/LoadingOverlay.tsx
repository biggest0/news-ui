import CatLoading from "@/assets/cat_loading.gif";

export const LoadingOverlay = () => {
	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-gray-700">
			<img src={CatLoading} alt="Loading" className="w-32 h-32" />
			<div>Loading...</div>
		</div>
	);
};
