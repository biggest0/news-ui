import { SectionHeader } from "@/components/common/layout/SectionHeader";

export default function DisclaimerPage() {
	return (
		<>
			<section className="border-b border-gray-400 py-6">
				<SectionHeader title="DISCLAIMER" />
				{/* Text body */}
				<div className="space-y-6 pt-4 text-center flex flex-col">
					<div>
						All content on Catire Time is for entertainment purposes only. This
						is a satire website.
					</div>
					<div>
						The articles on this site are satirical works based on real current
						events. While inspired by actual news, the stories presented are
						heavily fictionalized, exaggerated, and infused with humor, puns,
						and satire. They are not to be taken as factual news reports.
					</div>
					<div>
						Much of our content is generated with the assistance of artificial
						intelligence (AI), which combines real-world events with absurdity
						and humor.
					</div>
					<div>
						Names, characters, businesses, places, events, and incidents are
						either drawn from the original source, entirely fictional, or
						presented with satirical intent. Any resemblance to actual persons,
						living or dead, or actual events is purely coincidental and is not
						intended to be defamatory or malicious.
					</div>
					<div>
						Catire Time makes no representations or warranties of any kind,
						express or implied, about the completeness, accuracy, reliability,
						or suitability of any information on this site. Any reliance you
						place on such information is therefore strictly at your own risk.
					</div>
					<div>
						For accurate and up-to-date news, please consult reputable news
						organizations. Catire Time is not for factual information.
					</div>
				</div>
			</section>
		</>
	);
}
