import { SectionHeader } from "@/components/common/SectionHeader";

export default function Contact() {
	return (
		<>
			<section className="border-b border-gray-400 py-6">
				<SectionHeader title="CONTACT" />
				{/* Text body */}
				<div className="space-y-6 pt-4">
					{/* Catire Time */}
					<div className="text-center">
						<h3 className="text-lg text-gray-800">Email</h3>
						<div>catirecontact@gmail.com</div>
					</div>
					<div className="text-center flex flex-col">
						<h3 className="text-lg text-gray-800">Socials</h3>
						<a
							href="https://www.instagram.com/catiretime"
							target="_blank"
							rel="noopener noreferrer"
						>
							Instagram: catiretime
						</a>
						<a
							href="https://www.youtube.com/@catiretime"
							target="_blank"
							rel="noopener noreferrer"
						>
							YouTube: catiretime
						</a>
						<a
							href="https://x.com/catiretime"
							target="_blank"
							rel="noopener noreferrer"
						>
							X: catiretime
						</a>
					</div>
				</div>
			</section>
		</>
	);
}
