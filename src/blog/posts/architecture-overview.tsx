import type { BlogPostMeta } from "@/types/blogTypes";

export const meta: BlogPostMeta = {
	slug: "architecture-overview",
	title: "How Catire Time Is Built",
	date: "2026-04-29",
	summary:
		"A high-level look at the stack, how state is split between Redux and context, and how auth ties the front and back end together.",
	tags: ["architecture", "frontend"],
};

export default function ArchitectureOverviewPost() {
	return (
		<>
			<p>
				Catire Time is a small satirical news site I'm using as a playground
				for trying out modern frontend tooling. The frontend is React with
				TypeScript, Vite, Redux Toolkit, and Tailwind v4 (CSS-first — no
				<code>tailwind.config.js</code>).
			</p>

			<h2>State management</h2>
			<p>
				Server data lives in Redux: articles, recommendations, and per-user
				content like reading history. UI preferences (theme, section
				visibility, layout) live in a React context backed by{" "}
				<code>localStorage</code>. The rule is simple: server data in Redux,
				UI state in context.
			</p>

			<h2>Styling</h2>
			<p>
				Colors are semantic CSS tokens (<code>text-primary</code>,{" "}
				<code>bg-elevated</code>, etc.) defined in <code>src/index.css</code>{" "}
				and switched in dark mode via a single <code>html.dark</code> class.
				Components don't hardcode <code>dark:</code> variants except for the
				rare exception that doesn't fit the system.
			</p>

			<h2>What's next</h2>
			<p>
				Future posts will dig into specific decisions: semantic search, the
				recommendations pipeline, infinite scroll vs pagination, and so on.
			</p>
		</>
	);
}
