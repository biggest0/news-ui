import { CgInstagram } from "react-icons/cg";
import { TfiYoutube } from "react-icons/tfi";
import { RiTwitterXFill } from "react-icons/ri";

export default function SocialMediaLinks() {
    return (
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
    );
}

