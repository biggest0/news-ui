import { Link } from "react-router-dom";

import { CgInstagram } from "react-icons/cg";
import { TfiYoutube } from "react-icons/tfi";
import { RiTwitterXFill } from "react-icons/ri";

import SubscribeButton from "@/components/common/SubscribeButton";

export default function Footer() {
	return (
		<footer className="bg-white border-t border-gray-200 mt-6">
			{/* Top Section */}
			<div className="px-8 py-12 grid grid-cols-1 justify-items-center md:justify-items-start md:grid-cols-2 gap-8 w-full max-w-[1280px] mx-auto">
				{/* Left side - Logo, caption, social */}
				<div className="flex flex-col items-center md:items-start space-y-4">
					<div className="text-2xl font-bold text-gray-800">Catire Time</div>
					<div className="text-sm text-gray-600">
						Your daily dose of humour... I mean mews
					</div>
					<div className="flex gap-4 mt-2">
						<a
							href="https://www.instagram.com/catiretime"
							target="_blank"
							rel="noopener noreferrer"
						>
							<CgInstagram className="w-5 h-5 text-gray-500 hover:text-black cursor-pointer" />
						</a>

						<a
							href="https://x.com/catiretime"
							target="_blank"
							rel="noopener noreferrer"
						>
							<RiTwitterXFill className="w-5 h-5 text-gray-500 hover:text-black cursor-pointer" />
						</a>

						<a
							href="https://www.youtube.com/@catiretime"
							target="_blank"
							rel="noopener noreferrer"
						>
							<TfiYoutube className="w-5 h-5 text-gray-500 hover:text-black cursor-pointer" />
						</a>
					</div>
				</div>

				{/* Right side - Mailing list */}
				<SubscribeButton />
			</div>

			{/* Bottom section */}
			<div className="text-center py-6 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap justify-center gap-6">
				<span>Catire Time © 2025</span>
				<Link className="cursor-pointer hover:text-black" to="/disclaimer">
					Disclaimer
				</Link>
				<Link className="cursor-pointer hover:text-black" to="/about">
					About Us
				</Link>
				<Link className="cursor-pointer hover:text-black" to="/contact">
					Contact
				</Link>
			</div>
		</footer>
	);
}
