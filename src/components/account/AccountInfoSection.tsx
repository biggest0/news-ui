import { useTranslation } from "react-i18next";

import { AccountInfoForm } from "@/components/account/AccountInfoForm";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { UserInfo } from "@/types/localStorageTypes";
import { USER_INFO } from "@/constants/keys";

export const AccountInfoSection = () => {
	const { t } = useTranslation();
	const [userInfo, setUserInfo] = useLocalStorage<UserInfo>(USER_INFO, {});

	return (
		<>
			<AccountInfoForm
				key="form-name"
				userInfo={userInfo}
				fieldName="name"
				placeHolderText={t("ACCOUNT.NAME")}
				setUserInfo={setUserInfo}
			/>
			<AccountInfoForm
				key="form-bio"
				userInfo={userInfo}
				fieldName="biography"
				placeHolderText={t("ACCOUNT.BIO")}
				setUserInfo={setUserInfo}
			/>
		</>
	);
};
