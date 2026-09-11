import type { IconType } from "react-icons";
import { CgInstagram } from "react-icons/cg";
import { TfiYoutube } from "react-icons/tfi";
import { RiTwitterXFill } from "react-icons/ri";

import { SOCIAL_PROFILES, type SocialProfileId } from "@/constants/site";

/** Icon per profile; the URLs and labels come from constants/site.ts. */
const ICONS: Record<SocialProfileId, IconType> = {
	instagram: CgInstagram,
	x: RiTwitterXFill,
	youtube: TfiYoutube,
};

/** Icon links to the brand's social profiles (footer + mobile menu). */
export default function SocialMediaLinks() {
	return (
		<div className="flex gap-4 mt-2">
			{SOCIAL_PROFILES.map(({ id, label, url }) => {
				const Icon = ICONS[id];
				return (
					<a
						key={id}
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={label}
					>
						<Icon className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
					</a>
				);
			})}
		</div>
	);
}
