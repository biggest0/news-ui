import type { ComponentType } from "react";

export interface BlogPostMeta {
	slug: string;
	title: string;
	date: string;
	summary: string;
	tags?: string[];
}

export interface BlogPost extends BlogPostMeta {
	Component: ComponentType;
}
