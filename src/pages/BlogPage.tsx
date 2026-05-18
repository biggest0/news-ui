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
				<div className="pt-2">
					{BLOG_POSTS.map((post) => (
						<article key={post.slug} className="border-b border-border py-4 w-full">
							<h2 className="text-xl font-semibold text-primary">
								<Link
									to={`/blog/${post.slug}`}
									className="hover:text-accent transition-colors"
								>
									{post.title}
								</Link>
							</h2>
							<div className="text-sm text-muted">{post.date}</div>
							<p className="text-md text-secondary mt-8 mb-8">
								{post.summary}
							</p>
							<Link
								to={`/blog/${post.slug}`}
								className="text-md text-accent hover:underline"
							>
								{t("BLOG.READ_POST")}
							</Link>
						</article>
					))}
				</div>
			)}
		</section>
	);
}
