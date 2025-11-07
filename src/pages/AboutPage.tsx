import { Link } from "react-router-dom";

import { SectionHeader } from "@/components/common/SectionHeader";

export default function About() {
	return (
		<>
			<section className="border-b border-gray-400 py-6">
				<SectionHeader title="ABOUT" />
				{/* Text body */}
				<div className="space-y-6 pt-4">
					{/* Catire Time */}
					<div className="text-center">
						<h3 className="text-lg text-gray-800">Catire Time</h3>
						<div>
							The only news organization on the internet founded, operated, and
							exclusively staffed by cats. You see, we got tired of watching our
							humans stare at their glowing rectangles, looking all stressed out
							about the news. It looked dreadfully boring. So we did what cats
							do best: we decided to help. We walked across the keyboards, sat
							on the routers, and eventually (through a series of tactical naps
							on warm laptops) accidentally created this news platform.
						</div>
					</div>
					{/* Our mission */}
					<div className="text-center">
						<h3 className="text-lg text-gray-800">Our Mission</h3>
						<div>
							Let's be transparent. We're not here to "inform the public" or
							"uphold democracy." We're here for one reason and one reason only:
							tuna. Our mission is to generate enough revenue to one day achieve
							The Dream: a life where we eat nothing but sashimi-grade,
							sustainably-fished, Pacific Bluefin Tuna. No more kibble. No more
							mysterious "fish-flavored" jelly. Just the good stuff. Every
							article you read, every ad you (please) click, brings us one step
							closer to that glorious, fish-filled paradise.
						</div>
					</div>
					<div className="text-center">
						<h3 className="text-lg text-gray-800">Fun Reads</h3>
						<div>
							The motivation for this app is to make reading news more engaging
							and give readers control over how they experience it. Let's be
							honest, a lot of news is too long, gloomy, or just plain boring.
							Our goal is to make it enjoyable, like taking plain broccoli and
							drenching it in flavorful gravy. We let readers choose exactly how
							deeply they want to engage. They can start with a catchy title,
							skim a quick summary, or dive into the full content. It’s a
							'three-speed' approach that matches how people naturally consume
							information today: quickly, selectively, and with ease.
						</div>
					</div>
					{/* Disclaimer */}
					<div className="text-center">
						<h3 className="text-lg text-gray-800">Disclaimer</h3>
						<div>
							This is a satire site. All our articles are jokes based on real
							events. Please do not use us as a source for... well, anything,
							really. We are cats. We are not journalists.
						</div>
						<Link
							className="cursor-pointer hover:text-black underline"
							to="/disclaimer"
						>
							Full Disclaimer
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
