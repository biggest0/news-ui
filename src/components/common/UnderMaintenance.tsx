import Image from "@/assets/maintenance_hero_image.jpg";

export const UnderMaintenance = () => {
	return (
		<div className="flex flex-col items-center text-center py-6 border-b border-gray-400">
			<img
				src={Image}
				alt="Cats at work"
				className="w-full h-full object-contain mb-6"
			/>
			<h2 className="text-xl md:text-3xl font-bold text-gray-800">
				This page is still in purr-duction 🐱🔧
			</h2>
			<p className="mt-2">Our kit-terns are hard at work!</p>
		</div>
	);
};
