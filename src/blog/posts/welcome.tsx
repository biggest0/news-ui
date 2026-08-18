import type { BlogPostMeta } from "@/types/blogTypes";

export const meta: BlogPostMeta = {
	slug: "welcome",
	title: "Welcome to the Catire Time Blog",
	date: "4/30/2026",
	summary:
		"A short note on what this blog is for and what you can expect to find here.",
	tags: ["meta"],
};

export default function WelcomePost() {
	return (
		<>
			<p>
				This is a small corner of Catire Time for the things that don't fit in
				an article: how we pick the stories, why we write them the way we do,
				and what we're working on next.
			</p>
			<p>
				Posts here won't be frequent. We'll publish when something about the
				site genuinely changes, or when a small idea is worth a paragraph or
				two. Think of it less as a feed and more as a slow-moving notebook.
			</p>
			<p>
				If you've just arrived and want the short version of what this place
				is for, start with "How Catire Time Started" blog post.
			</p>
		</>
	);
}
