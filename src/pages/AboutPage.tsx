import { UnderMaintenance } from "@/components/common/UnderMaintenance";
import { SectionHeader } from "@/components/common/SectionHeader";

export default function About() {
	return (
		<>
			<section className="border-b border-gray-400 py-6">
				<SectionHeader title="ABOUT" />
				<UnderMaintenance />
			</section>
		</>
	);
}
