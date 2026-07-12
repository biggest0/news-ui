import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/contexts/AuthContext";
import {
	useGetLikeStatusQuery,
	useToggleLikeMutation,
} from "@/store/api/userContentEndpoints";

interface LikeButtonProps {
	articleId: string;
	initialLikeCount: number;
}

/**
 * Heart toggle on article cards — RTK Query consumer. The like-status query
 * is skipped for anonymous users (card shows the count baked into the
 * article data); the toggle mutation writes its response straight into the
 * status cache, so no follow-up fetch happens.
 */
export const LikeButton = ({
	articleId,
	initialLikeCount,
}: LikeButtonProps) => {
	const { t } = useTranslation();
	const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

	const { data: likeStatus } = useGetLikeStatusQuery(
		{ articleId },
		{ skip: isAuthLoading || !isAuthenticated }
	);
	const [toggleLike, { isLoading: isToggling }] = useToggleLikeMutation();

	const liked = likeStatus?.liked ?? false;
	const likeCount = likeStatus?.likeCount ?? initialLikeCount;

	const [showLoginMessage, setShowLoginMessage] = useState(false);

	const handleToggleLike = async () => {
		if (!isAuthenticated) {
			setShowLoginMessage(true);
			setTimeout(() => setShowLoginMessage(false), 3000);
			return;
		}

		if (isToggling) return;

		try {
			await toggleLike({ articleId }).unwrap();
		} catch {
			// cache keeps the previous status; nothing local to revert
		}
	};

	return (
		<div className="relative">
			<button
				onClick={handleToggleLike}
				aria-label={t("ARTICLE_CARD.LIKE")}
				aria-pressed={liked}
				className={`flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${
					liked
						? "text-red-300"
						: "hover:text-red-300"
				}`}
			>
				{/* red-300 heart is a deliberate one-off (soft pink in both themes) — not tokenized */}
				{liked ? (
					<GoHeartFill className="w-4 h-4" />
				) : (
					<GoHeart className="w-4 h-4" />
				)}
				{likeCount > 0 && <span className="text-sm">{likeCount}</span>}
			</button>
			{showLoginMessage && (
				<div className="absolute bottom-full right-1/2 mb-2 whitespace-nowrap text-sm bg-card text-foreground-secondary border border-border rounded px-2 py-1 shadow-sm">
					{t("ARTICLE_CARD.LOGIN_TO_LIKE")}
				</div>
			)}
		</div>
	);
};
