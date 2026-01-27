import EditorsSection from "../section/EditorsSection";
import CatFactsSection from "../section/CatFactsSection";
import StaffPicksSection from "../section/StaffPicksSection";

export default function NewsSideColumn() {

	return (
		<div className="hidden md:flex flex-col space-y-6 pl-4 border-l border-gray-400 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
			{/* Cat editors */}
			<EditorsSection />

			{/* Staff picks, for future */}
			<StaffPicksSection />

			{/* Cat facts */}
			<CatFactsSection />

			{/* cat merch */}
			{/* <div className="">
				<SectionHeader title="CAT MERCH" />
				<div className="border-b border-gray-400 py-4">
					<div>Coming one day ...</div>
				</div>
			</div> */}
		</div>
	);
}
