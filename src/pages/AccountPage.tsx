import { SectionHeader } from "@/components/common/SectionHeader";
import { AccountNewsSection } from "@/components/news/newsSection/AccountNewsSection";
import { AccountInfoSection } from "@/components/forms/AccountInfoSection";
import { USER_ARTICLE_HISTORY } from "@//constants/keys";

export default function AccountPage() {
	return (
		<>
			<section className="py-6">
				<SectionHeader title="ACCOUNT" />

				<div className="pt-4 pb-6 border-b border-gray-400 ">
					<AccountInfoSection />
				</div>

				<div className="pt-6">
					<AccountNewsSection localStorageKey={USER_ARTICLE_HISTORY} />
				</div>
			</section>
		</>
	);
}
