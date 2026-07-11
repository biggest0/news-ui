import { postArticleRead } from "@/api/userArticleApi";

/**
 * M5 note: like/history reads and mutations moved to RTK Query
 * (store/api/userContentEndpoints.ts). Only read-recording remains.
 */

/**
 * Records that the user read an article.
 * Fire-and-forget — do not await.
 */
export function recordArticleRead(articleId: string) {
	postArticleRead(articleId);
}
