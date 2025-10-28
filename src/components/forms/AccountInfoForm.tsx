import { useState } from "react";

import type { UserInfo } from "@/types/localStorage";

interface AccountInfoFormProp {
	userInfo: UserInfo;
	fieldName: keyof UserInfo;
	placeHolderText: string;
	setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

export const AccountInfoForm = ({
	userInfo,
	fieldName,
	placeHolderText,
	setUserInfo,
}: AccountInfoFormProp) => {
	const [inputValue, setInputValue] = useState(userInfo[fieldName] || "");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setUserInfo((prev) => ({ ...prev, [fieldName]: inputValue }));
	};

	return (
		<>
			<div>
				<h2 className="text-sm">{placeHolderText}</h2>
				<form
					className="flex items-center w-full max-w-96 border-b overflow-hidden mb-4"
					onSubmit={handleSubmit}
				>
					<input
						type="text"
						id={fieldName}
						name={fieldName}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder={placeHolderText}
						className="flex-grow pt-2 pb-1 outline-none text-gray-700"
					/>
					<button
						type="submit"
						className="text-gray-400 px-4 pt-2 pb-1 hover:text-black transition cursor-pointer"
					>
						Save
					</button>
				</form>
			</div>
		</>
	);
};
