/**
 * Brand identity shared by the UI, the share/SEO metadata, and structured data.
 *
 * Two other places carry copies of some of these values and say so: the
 * site-wide JSON-LD graph in index.html (Organization `sameAs`, logo) and
 * `scripts/prerenderRoutes.mjs` (site name, share image, logo), which runs in
 * plain Node and can't import this module. Change a value here, then there.
 */

/** Publisher name used in structured data. Stable across UI languages. */
export const SITE_NAME = "Catire Time";

/** Brand spelling with the cat-tail Ç, exposed as schema.org `alternateName`. */
export const SITE_ALTERNATE_NAME = "Çatire Time";

/** X / Twitter handle for `twitter:site`. */
export const TWITTER_HANDLE = "@catiretime";

/** Public social profiles, in display order. Platform names are proper nouns and stay untranslated. */
export const SOCIAL_PROFILES = [
	{ id: "instagram", label: "Instagram", handle: "catiretime", url: "https://www.instagram.com/catiretime" },
	{ id: "x", label: "X", handle: "catiretime", url: "https://x.com/catiretime" },
	{ id: "youtube", label: "YouTube", handle: "catiretime", url: "https://www.youtube.com/@catiretime" },
] as const;

export type SocialProfileId = (typeof SOCIAL_PROFILES)[number]["id"];

/**
 * Default share image for Open Graph / Twitter cards. Lives in public/ so the
 * URL is stable across builds (hashed asset URLs would break cached previews).
 */
export const SHARE_IMAGE = {
	path: "/og-image.jpg",
	width: 1200,
	height: 630,
} as const;

/** Publisher logo for Article structured data (Google asks for at least 112px square). */
export const PUBLISHER_LOGO = {
	path: "/images/logo-512.png",
	width: 512,
	height: 512,
} as const;
