import EditorsSection from "../section/EditorsSection";
import CatFactsSection from "../section/CatFactsSection";
import StaffPicksSection from "../section/StaffPicksSection";

export default function NewsSideColumn() {

	return (
		<>
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
		</>
	);
}
