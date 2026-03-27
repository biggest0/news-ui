import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { AccountNewsSection } from "@/components/news/section/AccountNewsSection";
import { AccountInfoSection } from "@/components/account/AccountInfoSection";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { logout, user } = useAuth();

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	return (
		<>
			<section className="py-6">
				<div className="flex items-center justify-between">
					<SectionHeader title="ACCOUNT" />
					<button
						onClick={handleLogout}
						className="text-sm text-muted hover:text-primary transition-colors cursor-pointer"
					>
						{t("AUTH.LOGOUT")}
					</button>
				</div>

				<div className="pt-4 pb-6 border-b border-border">
					<AccountInfoSection />
					{user && (
						<p className="text-sm text-muted">{user.email}</p>
					)}
				</div>

				<div className="pt-6">
					<AccountNewsSection />
				</div>
			</section>
		</>
	);
}
