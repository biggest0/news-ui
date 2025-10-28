import { AccountInfoForm } from "@/components/forms/AccountInfoForm";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { UserInfo } from "@/types/localStorage";
import { USER_INFO } from "@/constants/keys";

export const AccountInfoSection = () => {
	const [userInfo, setUserInfo] = useLocalStorage<UserInfo>(USER_INFO, {});
	return (
		<>
			<AccountInfoForm
				key="form-name"
				userInfo={userInfo}
				fieldName="name"
				placeHolderText={"Name"}
				setUserInfo={setUserInfo}
			/>
			<AccountInfoForm
				key="form-bio"
				userInfo={userInfo}
				fieldName="biography"
				placeHolderText={"Bio"}
				setUserInfo={setUserInfo}
			/>
		</>
	);
};
