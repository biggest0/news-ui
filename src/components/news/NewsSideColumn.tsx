import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import CatImage1 from "@/assets/ChatGPT Image Apr 13, 2025, 11_38_22 AM.png";
import type { RootState, AppDispatch } from "@/store/store";
import { loadTopTenArticles } from "@/store/articlesSlice";

export default function NewsSideColumn() {
	const dispatch = useDispatch<AppDispatch>();
	const { topTenArticles, loading, error } = useSelector(
		(state: RootState) => state.article
	);

	return (
		<>
			{/* our editors */}
			<div className="space-y-4">
				<h3 className="text-gray-500">OUR EDITORS</h3>

				<div className="flex flex-row justify-between border-b border-gray-400 py-4">
					<div className="flex flex-row justify-between space-x-8">
						<div className="flex flex-col justify-between min-h-24 max-h-full">
							<div className="flex flex-col">
								<div>Albert Meowstein</div>
								<div>Chief Editor</div>
							</div>
							<div className="text-sm text-gray-500">
								A cheeky cat that does nothing but read
							</div>
						</div>
						<img
							src={CatImage1}
							alt=""
							className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
						/>
					</div>
				</div>

				<div className="flex flex-row justify-between border-b border-gray-400 py-4">
					<div className="flex flex-row space-x-8 items-start">
						<div className="flex flex-col justify-between min-h-24 max-h-full max-w-sm">
							<div className="flex flex-col">
								<div className="font-semibold">Albert Meowstein</div>
								<div className="text-gray-600">Chief Editor</div>
							</div>
							<div className="text-sm text-gray-500 whitespace-normal break-words">
								A cheeky cat that does nothing but read ads;fasjdfkl;asjfklas
								jdfkl;aalksdfj;lajsdfkasfdsakl;fj;asdl
							</div>
						</div>
						<img
							src={CatImage1}
							alt=""
							className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
						/>
					</div>
				</div>

				<div className="flex flex-row justify-between border-b border-gray-400 py-4">
					<div className="flex flex-row justify-between space-x-8">
						<div className="flex flex-col justify-between h-28">
							<div className="flex flex-col">
								<div>Albert Meowstein</div>
								<div>Chief Editor</div>
							</div>
							<div className="text-sm text-gray-500">
								A cheeky cat that does nothing but read
							</div>
						</div>
						<img src={CatImage1} alt="" className="w-auto h-28" />
					</div>
				</div>
			</div>

			{/* staff favorites, for future */}
			<div className="space-y-4">
				<h3 className="text-gray-500">STAFF FAVORITES</h3>

				{topTenArticles.slice(0, 5).map((article) => (
					<div className="border-b border-gray-400 py-4">{article.title}</div>
				))}
			</div>

			{/* cat facts */}
			<div className="space-y-4">
				<h3 className="text-gray-500">RANDOM CAT FATS</h3>

				<div className="flex flex-col justify-between border-b border-gray-400 py-4">
					<h4>Cats can't taste sugar</h4>
					<div>
						Which explains why your cheesecake goes untouched — not because your
						cat has self-control, but because evolution spared them from
						diabetes.
					</div>
				</div>

				<div className="flex flex-col justify-between border-b border-gray-400 py-4">
					<h4>Cats only meow at humans</h4>
					<div>
						It’s not a sign of affection. It’s their way of saying, “Dance,
						servant, dance.”
					</div>
				</div>

				<div className="flex flex-col justify-between border-b border-gray-400 py-4">
					<h4>Cats purr to heal bones</h4>
					<div>
						Yes, their purrs can speed up healing. Basically, your cat is a
						furry chiropractor with zero medical license.
					</div>
				</div>

				<div className="flex flex-col justify-between border-b border-gray-400 py-4">
					<h4>Cats can fit through holes as small as their head</h4>
					<div>
						This isn’t a magic trick. It’s just physics mixed with chaos.
					</div>
				</div>

				<div className="flex flex-col justify-between border-b border-gray-400 py-4">
					<h4>Cats can run 30 mph</h4>
					<div>
						Impressive — until you realize they only use this Olympic-level
						speed to launch themselves across your bed at 3 a.m.
					</div>
				</div>
			</div>

			{/* cat merch */}
			<div className="space-y-4">
				<h3 className="text-gray-500">CAT MERCH</h3>
				<div className="border-b border-gray-400 py-4">
					<div>Coming one day ...</div>
				</div>
			</div>
		</>
	);
}
