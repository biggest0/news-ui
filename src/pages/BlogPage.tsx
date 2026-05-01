import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { BLOG_POSTS } from "@/blog/registry";

export default function BlogPage() {
	const { t } = useTranslation();

	return (
		<section className="py-6">
			<SectionHeader title={t("BLOG.TITLE")} />

			{BLOG_POSTS.length === 0 ? (
				<p className="pt-4 text-muted">{t("BLOG.NO_POSTS")}</p>
			) : (
				<div className="pt-2 divide-y divide-border-subtle">
					{BLOG_POSTS.map((post) => (
						<article key={post.slug} className="py-6">
							<div className="text-xs text-muted mb-1">{post.date}</div>
							<h2 className="text-2xl text-primary mb-2">
								<Link
									to={`/blog/${post.slug}`}
									className="hover:text-accent transition-colors"
								>
									{post.title}
								</Link>
							</h2>
							<p className="text-secondary leading-relaxed mb-3">
								{post.summary}
							</p>
							<Link
								to={`/blog/${post.slug}`}
								className="text-sm text-accent hover:underline"
							>
								{t("BLOG.READ_MORE")}
							</Link>
						</article>
					))}
				</div>
			)}
		</section>
	);
}
