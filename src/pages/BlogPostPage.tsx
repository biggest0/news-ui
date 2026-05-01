import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { findBlogPost } from "@/blog/registry";

export default function BlogPostPage() {
	const { t } = useTranslation();
	const { slug } = useParams<{ slug: string }>();
	const post = slug ? findBlogPost(slug) : undefined;

	if (!post) {
		return (
			<section className="py-6">
				<Link to="/blog" className="text-sm text-accent hover:underline">
					← {t("BLOG.BACK_TO_BLOG")}
				</Link>
				<p className="pt-6 text-muted text-center">{t("BLOG.NOT_FOUND")}</p>
			</section>
		);
	}

	const { Component, title, date, tags } = post;

	return (
		<section className="py-6">
			<Link to="/blog" className="text-sm text-accent hover:underline">
				← {t("BLOG.BACK_TO_BLOG")}
			</Link>

			<div className="max-w-2xl mx-auto">
				<header className="pt-4 pb-6 border-b border-border-subtle">
					<div className="text-xs text-muted mb-2">{date}</div>
					<h1 className="text-3xl text-primary mb-2">{title}</h1>
					{tags && tags.length > 0 && (
						<div className="flex flex-wrap gap-2 pt-2">
							{tags.map((tag) => (
								<span
									key={tag}
									className="text-xs text-muted px-2 py-0.5 rounded bg-elevated border border-border-subtle"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</header>

				<article className="blog-prose pt-6">
					 {/* React component exported from your .tsx post file in the posts/ folder. It just renders it here like any normal component */}
					<Component />
				</article>
			</div>
		</section>
	);
}
