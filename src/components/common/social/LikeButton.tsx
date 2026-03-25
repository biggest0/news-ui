import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/contexts/AuthContext";
import { toggleArticleLike } from "@/service/userArticleService";

interface LikeButtonProps {
	articleId: string;
	initialLikeCount: number;
	initialLiked?: boolean;
}

export const LikeButton = ({
	articleId,
	initialLikeCount,
	initialLiked = false,
}: LikeButtonProps) => {
	const { t } = useTranslation();
	const { accessToken, isAuthenticated } = useAuth();
	const [liked, setLiked] = useState(initialLiked);
	const [likeCount, setLikeCount] = useState(initialLikeCount);
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
						? "text-accent"
						: "hover:text-accent"
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
