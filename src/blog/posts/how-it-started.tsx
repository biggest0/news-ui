import type { BlogPostMeta } from "@/types/blogTypes";

export const meta: BlogPostMeta = {
	slug: "how-it-started",
	title: "How Catire Time Started",
	date: "8/18/2026",
	summary:
		"Why we started turning the day's events into short satire you can actually finish, and where the cat comics come in.",
	tags: ["origin", "about"],
};

export default function HowItStartedPost() {
	return (
		<>
			<p>
				We like knowing what's going on. Between us, we spend more time than
				we'd like to admit scrolling Reddit, hopping between news sites,
				watching stock tickers move, and doomscrolling social media.
			</p>
			<p>
				The trouble is that keeping up with the world is draining. A single
				story can run two thousand words, most of it fluff and filler, when all
				you wanted was what happened and why it matters. There's only so much
				attention to go around in a day, between work, family, hobbies, and
				everything else.
			</p>
			<p>Some days you just don't have it in you to:</p>
			<ul>
				<li>check five platforms to find out what happened</li>
				<li>read long blocks of text to get to one fact</li>
				<li>be handed more depressing news</li>
			</ul>
			<p>
				So we started doing it our own way. The daily reading falls to the
				teammates who can't seem to get enough of this stuff. They work out
				what actually happened, pick what's worth passing on, connect the dots,
				and hand it back as a few short paragraphs with the absurdity turned
				up, and jokes where jokes fit. The satire is the point. So is walking
				away actually knowing something happened.
			</p>

			<h2>Our articles</h2>
			<p>
				Every piece is short and plainly worded. You can finish one faster than
				a reel. The plain words are deliberate: nobody should need a second read
				to get it. One event, whether a global story or a market swing,
				condensed into two honest paragraphs.
			</p>
			<p>
				None of this replaces real reporting. If you want the full picture, go
				read the outlets that do it properly, with sources, context, and
				follow-ups. Think of us as the version you read when you want to know
				roughly what the world did today, without setting aside an hour for it.
			</p>

			<h2>Coming soon: cat comics</h2>
			<p>
				Text isn't for everyone. The next thing we're building is a drawn
				version of the day's stories: same events, with cats explaining and
				acting them out. Fewer words, and the pictures do the work.
			</p>
		</>
	);
}
