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
                aria-label="Instagram"
            >
                <CgInstagram className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </a>

            <a
                href="https://x.com/catiretime"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
            >
                <RiTwitterXFill className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </a>

            <a
                href="https://www.youtube.com/@catiretime"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
            >
                <TfiYoutube className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </a>
        </div>
    );
}

