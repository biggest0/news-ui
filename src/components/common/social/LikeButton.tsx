import { useState, useEffect } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/contexts/AuthContext";
import {
	toggleArticleLike,
	getArticleLikeStatus,
} from "@/service/userArticleService";

interface LikeButtonProps {
	articleId: string;
	initialLikeCount: number;
}

export const LikeButton = ({
	articleId,
	initialLikeCount,
}: LikeButtonProps) => {
	const { t } = useTranslation();
	const { accessToken, isAuthenticated } = useAuth();
	const [liked, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(initialLikeCount);

	// When the user is authenticated, fetch the real like status from the server
	// (whether they've liked this article, and the current like count).
	// The cancellation flag prevents a stale response from updating state
	// if the component unmounts or the article/token changes before the fetch resolves.
	useEffect(() => {
		if (!isAuthenticated || !accessToken) return;

		let cancelled = false;
		getArticleLikeStatus(articleId, accessToken).then((status) => {
			if (cancelled) return;
			setLiked(status.liked);
			setLikeCount(status.likeCount);
		});
		return () => {
			cancelled = true;
		};
	}, [articleId, accessToken, isAuthenticated]);
	const [isToggling, setIsToggling] = useState(false);
	const [showLoginMessage, setShowLoginMessage] = useState(false);

	const handleToggleLike = async () => {
		if (!isAuthenticated || !accessToken) {
			setShowLoginMessage(true);
			setTimeout(() => setShowLoginMessage(false), 3000);
			return;
		}

		if (isToggling) return;

		// Optimistic update
		const previousLiked = liked;
		const previousCount = likeCount;
		setLiked(!liked);
		setLikeCount(liked ? likeCount - 1 : likeCount + 1);
		setIsToggling(true);

		try {
			const result = await toggleArticleLike(articleId, accessToken);
			setLiked(result.liked);
			setLikeCount(result.likeCount);
		} catch {
			// Revert on failure
			setLiked(previousLiked);
			setLikeCount(previousCount);
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
