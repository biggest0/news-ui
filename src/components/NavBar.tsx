// components/NavBar.tsx
import { User } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="w-full border-b-2 border-gray-200 shadow-sm z-20 px-8 py-3 flex items-center justify-between">
      {/* Left - Logo */}
      <div className="text-xl font-bold text-blue-600">
        📰
      </div>

      {/* Center - App Name */}
      <div className="text-lg font-semibold text-gray-800 tracking-wide">
        THE CATIRE TIMES
      </div>

      {/* Right - Icons */}
      <div className="flex gap-4 items-center text-gray-600">
        <User className="w-5 h-5 hover:text-black cursor-pointer" />
      </div>
    </nav>
  );
}
