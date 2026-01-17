import { useState } from "react";

import type { UserInfo } from "@/types/localStorageTypes";

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
	const [saved, setSaved] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setUserInfo((prev) => ({ ...prev, [fieldName]: inputValue }));

		setSaved(true);

		setTimeout(() => {
			setSaved(false);
		}, 2000);
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
						className={`px-4 pt-2 pb-1 transition cursor-pointer ${
							saved ? "text-green-600" : "text-gray-400 hover:text-black"
						}`}
					>
						{saved ? "Field Saved!" : "Save"}
					</button>
				</form>
			</div>
		</>
	);
};
