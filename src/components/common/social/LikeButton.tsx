import { useState, useEffect } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import { useAuth } from "@/contexts/AuthContext";
import type { AppDispatch, RootState } from "@/store/store";
import {
	loadArticleLikeStatus,
	toggleArticleLikeThunk,
} from "@/store/userContentSlice";

interface LikeButtonProps {
	articleId: string;
	initialLikeCount: number;
}

export const LikeButton = ({
	articleId,
	initialLikeCount,
}: LikeButtonProps) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { accessToken, isAuthenticated, isLoading: isAuthLoading } = useAuth();
	const likeStatus = useSelector(
		(state: RootState) => state.userContent.likes[articleId]
	);
	const liked = likeStatus?.liked ?? false;
	const likeCount = likeStatus?.likeCount ?? initialLikeCount;

	// When the user is authenticated, fetch the real like status from the server
	// (whether they've liked this article, and the current like count).
	useEffect(() => {
		if (isAuthLoading || !isAuthenticated || !accessToken) return;
		dispatch(loadArticleLikeStatus({ articleId, accessToken }));
	}, [articleId, accessToken, isAuthenticated, isAuthLoading, dispatch]);

	const [isToggling, setIsToggling] = useState(false);
	const [showLoginMessage, setShowLoginMessage] = useState(false);

	const handleToggleLike = async () => {
		if (!isAuthenticated || !accessToken) {
			setShowLoginMessage(true);
			setTimeout(() => setShowLoginMessage(false), 3000);
			return;
		}

		if (isToggling) return;

		setIsToggling(true);
		try {
			unwrapResult(
				await dispatch(toggleArticleLikeThunk({ articleId, accessToken }))
			);
		} catch {
			// Thunk reducer captures the error; state is derived from Redux
			// so there's no local state to revert.
		} finally {
			setIsToggling(false);
		}
	};

	return (
		<div className="relative">
			<button
				onClick={handleToggleLike}
				className={`flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${
					liked
						? "text-red-300"
						: "hover:text-red-300"
				}`}
			>
				{liked ? (
					<GoHeartFill className="w-4 h-4" />
				) : (
					<GoHeart className="w-4 h-4" />
				)}
				{likeCount > 0 && <span className="text-sm">{likeCount}</span>}
			</button>
			{showLoginMessage && (
				<div className="absolute bottom-full right-1/2 mb-2 whitespace-nowrap text-sm bg-elevated text-secondary border border-border rounded px-2 py-1 shadow-sm">
					{t("ARTICLE_CARD.LOGIN_TO_LIKE")}
				</div>
			)}
		</div>
	);
};
