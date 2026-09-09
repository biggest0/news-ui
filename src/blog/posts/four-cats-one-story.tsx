import type { BlogPostMeta } from "@/types/blogTypes";

export const meta: BlogPostMeta = {
	slug: "four-cats-one-story",
	title: "Four Cats, One Story",
	date: "8/27/2026",
	summary:
		"Every story gets written four times by four very different cats. Only one version runs. Here is how the tone gets picked.",
	tags: ["editors", "process"],
};

export default function FourCatsOneStoryPost() {
	return (
		<>
			<p>
				Here is the thing about news: the facts are just the fries. What decides
				whether a story gets eaten, shared, or left cold on the plate is the
				sauce. Same fries, different dip, completely different meal.
			</p>
			<p>
				So we hired four cats to argue about which dip goes with which fries. It
				turned out to be the best editorial decision we never planned to make.
				Every story that comes through our newsroom gets run past all four of
				them before it goes live.
			</p>

			<h2>Meet the editors</h2>
			<p>
				<strong>Fluffington</strong> handles extreme satire. He has no restraint
				and loves to overexagerate. If a pothole gets filled, Fluffington
				reports that the city has single-handedly ended the ancient war between
				rubber and asphalt. He is the most fun to sit next to and the most
				exhausting to edit.
			</p>
			<p>
				<strong>Purrscilla</strong> runs light and breezy. She writes like she is
				telling you good news over coffee, and she cannot end a sentence on a sad
				note. Where Fluffington sees war, Purrscilla sees a small win for
				everyone's morning commute.
			</p>
			<p>
				<strong>Sir Pawtenborough</strong> narrates like a nature documentary.
				Quiet, serious, and a little sad, as if every story is happening to a
				species that might not make it. A parking ticket becomes the tale of the
				commuter, cornered, forced to adapt or perish. For reasons nobody can
				explain, he is the editor people quote at dinner parties.
			</p>
			<p>
				<strong>The Baron</strong> owns the sales pitch. Everything is an
				opportunity, everything has a deadline, and everything ends with a call
				to action. He talks in italics even when he is not italicized. Nobody has
				ever seen him blink.
			</p>
			<p>
				<strong>Meowstein</strong> is our chief editor, the old wise one, and he
				does not write a single word. He reads every version, picks the one that
				runs, and sends the rest back with notes. He has been doing this longer
				than the other four have been alive, and he never explains his choices.
				He just slides the winning draft across the table and goes back to his
				nap.
			</p>

			<h2>How a story gets picked</h2>
			<p>
				A story comes in and all four cats write their own version. Nobody sees
				anyone else's draft.
			</p>
			<p>
				Then Meowstein reads them out loud. We call it the table read, because
				nothing kills a weak angle faster than hearing it said out loud. His test
				is simple: was that worth twenty seconds of my life?
			</p>
			<p>
				He ranks them. He fixes up the good ones. He rejects the rest. He does
				not pick the funniest version. He picks the tone that serves the story,
				the one that makes you feel what it is really about, whether that is
				anger, comfort, urgency, or awe. There is usually a clear winner.
				Once, and only once, it was a tie, so we ran a mix of the two.
			</p>
			<p>
				The tone is not just a style choice. It belongs to a cat, and that cat
				owns the piece.
			</p>
			<p>
				The cats keep a tally of whose writing wins. Fluffington's nonsense turns
				out to be the gentlest way to say something true. Heavy stories usually
				go to Sir Pawtenborough, because a documentary can do more work than a
				joke ever could. Purrscilla wins more often than anyone expects, mostly
				because being reassured is underrated. The Baron wins least, which he
				calls a market inefficiency we are actively correcting.
			</p>

			<h2>The same story, four ways</h2>
			<p>
				Take a recent one. The city approved a new roundabout at Maple and 5th.
				It sounds boring. It is boring.
			</p>
			<ul>
				<li>
					<strong>Fluffington:</strong> "Local Government Solves Traffic Crisis
					by Making Everyone Drive in Circles Forever."
				</li>
				<li>
					<strong>Purrscilla:</strong> "Good news, Maple Street. A smoother
					commute is coming your way."
				</li>
				<li>
					<strong>Sir Pawtenborough:</strong> "Here, at the intersection of
					Maple and Fifth, the commuter performs an ancient ritual passed down
					through generations: the yield."
				</li>
				<li>
					<strong>The Baron:</strong> "Introducing the roundabout you did not
					know you needed. Traffic will not wait, and neither should you."
				</li>
			</ul>
			<p>
				Four cats, four completely different reads, and not one fact changed.
				That story went to Purrscilla. It worked better as reassurance than as a
				joke, so that is the version that ran.
			</p>

			<h2>Why we bother</h2>
			<p>
				It would be much easier to write one version of every story and call it a
				day. But people are not only reacting to the facts. They are reacting to
				how the facts are handed to them.
			</p>
			<p>
				A city budget story told as satire lands as a joke with a point. The same
				story told straight and warm lands as comfort. Told like an infomercial,
				it lands as a jab at how everything gets sold to us these days.
			</p>
			<p>Same fries. Different sauce. Completely different meal.</p>
			<p>
				The cats would like it noted that this is, in their professional opinion,
				the only correct way to run a newsroom.
			</p>
		</>
	);
}
