import type { BlogPostMeta } from "@/types/blogTypes";

export const meta: BlogPostMeta = {
	slug: "welcome",
	title: "Welcome to the Catire Time Blog",
	date: "2026-04-30",
	summary:
		"A short note on what this blog is for and what you can expect to find here.",
	tags: ["meta"],
};

export default function WelcomePost() {
	return (
		<>
			<p>
				This is a small corner of Catire Time where I'll be writing about
				the design and engineering decisions behind the site.
			</p>
			<p>
				Posts here won't be frequent. I'll publish whenever something
				interesting changes architecturally, or when a small idea is worth
				a paragraph or two. Think of it less as a feed and more as a
				slow-moving notebook.
			</p>
			<p>
				If you're a developer poking around the codebase, the next post on
				architecture is probably the place to start.
			</p>
		</>
	);
}
