import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import type { RootState, AppDispatch } from "@/store/store";
import { EditorCardHorizontal } from "@/components/sideColumn/EditorCardHorizontal";
import { CATIRE_EDITORS, CAT_FACTS } from "@/components/sideColumn/constants";
import { CatFactsCard } from "@/components/sideColumn/CatFactsCard";
import { SectionHeader } from "@/components/common/SectionHeader";

export default function NewsSideColumn() {
	const dispatch = useDispatch<AppDispatch>();
	const { topTenArticles, loading, error } = useSelector(
		(state: RootState) => state.article
	);

	return (
		<>
			{/* our editors */}
			<section className="">
				<SectionHeader title="OUR EDITORS" />
				<div className="">
					{CATIRE_EDITORS.map((editor, index) => (
						<EditorCardHorizontal
							key={`editor-${index}`}
							name={editor.name}
							role={editor.role}
							description={editor.description}
							imageUrl={editor.imageUrl}
						/>
					))}
				</div>
			</section>

			{/* staff favorites, for future */}
			<div className="border-b border-gray-400 pb-6 space-y-4">
				<SectionHeader title="STAFF FAVORITES" />

				{topTenArticles.slice(0, 5).map((article) => (
					<div className="py-2" key={`side-${article.id}`}>
						{article.title}
					</div>
				))}
			</div>

			{/* cat facts */}
			<div className="">
				<SectionHeader title="RANDOM CAT FATS" />
				{CAT_FACTS.map((catFact, index) => (
					<CatFactsCard
						key={index}
						title={catFact.title}
						fact={catFact.fact}
						small={false}
					/>
				))}
			</div>

			{/* cat merch */}
			{/* <div className="">
				<SectionHeader title="CAT MERCH" />
				<div className="border-b border-gray-400 py-4">
					<div>Coming one day ...</div>
				</div>
			</div> */}
		</>
	);
}
