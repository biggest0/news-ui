import type { ComponentType } from "react";
import type { BlogPost, BlogPostMeta } from "@/types/blogTypes";

interface BlogPostModule {
	meta: BlogPostMeta;
	default: ComponentType;
}

// Drop a new <slug>.tsx file into ./posts/ and it shows up — no registration needed.
// scans the filesystem at build time and imports every .tsx file in the posts/ folder.
// eager: true = it loads them all immediately instead of lazy loading
const modules = import.meta.glob<BlogPostModule>("./posts/*.tsx", { eager: true });

export const BLOG_POSTS: BlogPost[] = Object.values(modules)
	.map((m) => ({ ...m.meta, Component: m.default })) // flattens each module into one object
	.sort((a, b) => b.date.localeCompare(a.date)); // sorts newest post first by comparing date strings

export const findBlogPost = (slug: string): BlogPost | undefined =>
	BLOG_POSTS.find((p) => p.slug === slug);
