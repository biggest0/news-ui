import { CgInstagram } from "react-icons/cg";
import { RiFacebookFill, RiTwitterXFill } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      {/* Top Section */}
      <div className="px-8 py-12 grid grid-cols-1 justify-items-center md:justify-items-start md:grid-cols-2 gap-8 w-full max-w-[1280px] mx-auto">
        {/* Left side - Logo, caption, social */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="text-2xl font-bold text-gray-800">📰 The Catire Times</div>
          <div className="text-sm text-gray-600">Your daily dose of humour... I mean mews</div>
          <div className="flex gap-4 mt-2">
            <RiFacebookFill className="w-5 h-5 text-gray-500 hover:text-black cursor-pointer" />
            <RiTwitterXFill className="w-5 h-5 text-gray-500 hover:text-black cursor-pointer" />
            <CgInstagram className="w-5 h-5 text-gray-500 hover:text-black cursor-pointer" />
          </div>
        </div>

        {/* Right side - Mailing list */}
        <div className="flex flex-col space-y-2">
          <h4 className="text-lg font-semibold text-gray-800">Subscribe to our newsletter</h4>
          <p className="text-sm text-gray-600">Get the latest news delivered to your inbox.</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom section */}
      <div className="text-center py-6 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap justify-center gap-6">
        <span>Placeholder © 2025</span>
        <span className="cursor-pointer hover:text-black">Disclaimer</span>
        <span className="cursor-pointer hover:text-black">About Us</span>
        <span className="cursor-pointer hover:text-black">Submissions</span>
      </div>
    </footer>
  );
}
