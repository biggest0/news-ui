import type { BlogPostMeta } from "@/types/blogTypes";

export const meta: BlogPostMeta = {
	slug: "building-the-site",
	title: "How We Designed Catire Time",
	date: "8/18/2026",
	summary:
		"Why the site looks like a newspaper, why you can rearrange the home page, and why you get to choose how you read.",
	tags: ["design", "about"],
};

export default function BuildingTheSitePost() {
	return (
		<>
			<h2>Making it feel like a newspaper</h2>
			<p>
				We wanted the site to feel like an early 2000s newspaper. So we used the
				kind of lettering you see in print. Fonts do more work than people
				realize. It might seem like a small thing, but it sets the tone for the
				whole site.
			</p>
			<p>
				Then came the colors. We went with a warm amber. Colors carry feeling,
				and to us this yellow and orange gives off warmth and cheer. Put it with
				the font and you get a look that has aged well for more than a hundred
				years. Print papers are nearly gone now, so we hope to keep its legacy going 
				digitally.
			</p>
			<p>
				We split the page into sections the way a paper would. Mews for the main
				feed, then Editors, Staff Picks, Popular, and Cat Facts. There is room
				set aside for ads and a daily comic strip too, just like the real thing.
			</p>

			<h2>Set it up your way</h2>
			<p>
				Most sites decide what the page looks like. You get what you get. We
				did the opposite. It was a lot more work, but worth it.
			</p>
			<p>
				Every section on the home page has a small menu in the corner. You can
				fold a section up to get it out of the way. Or you can remove it for
				good if you never want to see it again.
			</p>
			<p>
				Hide the cat facts. Keep the popular stories. Drop the recommendations.
				The home page ends up holding what you actually read, and nothing else.
				Change your mind later and an option to bring the sections back shows up
				in that same menu.
			</p>
			<p>
				How you read is your call too. The feed can keep loading as you scroll,
				or it can break into numbered pages.
			</p>
			<p>
				Whatever you choose sticks. Come back next week and the site still looks
				the way you left it.
			</p>
			<p>
				New visitors get a short tour that points all of this out. You can open
				the tour again from the About page any time.
			</p>

			<h2>Light, dark, and two languages</h2>
			<p>
				You can read the site in light or dark. There is a third setting that
				simply follows your phone or computer. If your screen dims at night, the
				site dims with it.
			</p>
			<p>
				We also publish in English and French. Not just the menus, the stories
				too. Switch the language and the article changes right where you are.
			</p>
			<p>
				These are small things. But they are the difference between a site you
				put up with and one you enjoy coming back to.
			</p>
		</>
	);
}
