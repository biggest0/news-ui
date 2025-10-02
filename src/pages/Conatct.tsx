import { SectionHeader } from "@/components/common/SectionHeader";
import { UnderMaintenance } from "@/components/common/UnderMaintenance";

export default function Contact() {
	return (
		<>
			<section className="border-b border-gray-400 py-6">
				<SectionHeader title="CONTACT" />
				<UnderMaintenance />
			</section>
		</>
	);
}
