import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { SiteFooter } from "#/components/layout/site-footer";
import { PageHeader } from "#/components/layout/page-header";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

export const Route = createFileRoute("/blog")({ component: BlogPage });

const TAG_COLORS: Record<string, string> = {
	tutorial: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25",
	update: "bg-sky-500/15 text-sky-400 ring-sky-500/25",
	design: "bg-fuchsia-500/15 text-fuchsia-400 ring-fuchsia-500/25",
	community: "bg-amber-500/15 text-amber-400 ring-amber-500/25",
	tips: "bg-violet-500/15 text-violet-400 ring-violet-500/25",
};

const BLOG_POSTS = [
	{
		key: "post1",
		tag: "tutorial",
		image: "https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=800&h=500&fit=crop&q=80",
		date: "2026-09-18",
		featured: true,
	},
	{
		key: "post2",
		tag: "design",
		image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop&q=80",
		date: "2026-09-15",
	},
	{
		key: "post3",
		tag: "update",
		image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop&q=80",
		date: "2026-09-12",
	},
	{
		key: "post4",
		tag: "community",
		image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&h=400&fit=crop&q=80",
		date: "2026-09-08",
	},
	{
		key: "post5",
		tag: "tips",
		image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop&q=80",
		date: "2026-09-04",
	},
	{
		key: "post6",
		tag: "design",
		image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&q=80",
		date: "2026-08-30",
	},
];

function BlogPage() {
	const sectionRef = useRef<HTMLElement>(null);
	const { t } = useTranslation();

	useGSAP(
		() => {
			gsap.from("[data-blog-reveal]", {
				y: 40,
				opacity: 0,
				duration: 0.9,
				ease: EASE.expo,
				stagger: 0.08,
			});
		},
		{ scope: sectionRef },
	);

	useEffect(() => { document.title = "Blog — ZINEFORGE"; }, []);

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr);
		return d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const featured = BLOG_POSTS[0];
	const grid = BLOG_POSTS.slice(1);

	return (
		<main ref={sectionRef} className="relative min-h-svh bg-ink-950">
			<PageHeader />

			{/* ── Page heading ── */}
			<section className="px-6 pb-16 sm:px-10 lg:px-20">
				<div className="mx-auto max-w-[1320px]">
					<span
						data-blog-reveal
						className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60"
					>
						{t("blogPage.badge")}
					</span>
					<h1
						data-blog-reveal
						className="mt-8 max-w-3xl text-4xl font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl"
					>
						{t("blogPage.heading")}
					</h1>
					<p
						data-blog-reveal
						className="mt-5 max-w-xl text-lg leading-relaxed text-white/45"
					>
						{t("blogPage.subheading")}
					</p>
				</div>
			</section>

			{/* ── Featured post ── */}
			<section className="px-6 pb-16 sm:px-10 lg:px-20">
				<div className="mx-auto max-w-[1320px]">
					<div
						data-blog-reveal
						className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-900/40 transition-colors duration-300 hover:border-white/[0.12]"
					>
						<div className="grid grid-cols-1 lg:grid-cols-2">
							{/* Image */}
							<div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[420px]">
								<img
									src={featured.image}
									alt=""
									loading="lazy"
									className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
								/>
								{/* Gradient overlay on image */}
								<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink-950/80" />
							</div>

							{/* Content */}
							<div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
								<div className="flex items-center gap-3">
									<span
										className={cn(
											"rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ring-1 ring-inset",
											TAG_COLORS[featured.tag] ?? "bg-white/10 text-white/60 ring-white/20",
										)}
									>
										{t(`blogPage.tags.${featured.tag}`)}
									</span>
									<span className="text-xs text-white/30">
										{formatDate(featured.date)}
									</span>
								</div>
								<h2 className="mt-5 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
									{t(`blogPage.posts.${featured.key}.title`)}
								</h2>
								<p className="mt-4 text-[15px] leading-relaxed text-white/45">
									{t(`blogPage.posts.${featured.key}.excerpt`)}
								</p>
								<div className="mt-8">
									<span className="inline-flex items-center gap-2 text-sm font-semibold text-[#f97505] transition-colors group-hover:text-[#ffb060]">
										{t("blogPage.readMore")}
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
											<path d="M5 12h14"/>
											<path d="m12 5 7 7-7 7"/>
										</svg>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── Grid posts ── */}
			<section className="px-6 pb-24 sm:px-10 lg:px-20">
				<div className="mx-auto max-w-[1320px]">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{grid.map((post) => (
							<article
								key={post.key}
								data-blog-reveal
								className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900/30 transition-colors duration-300 hover:border-white/[0.12] hover:bg-ink-900/50"
							>
								{/* Image */}
								<div className="relative aspect-[16/10] overflow-hidden">
									<img
										src={post.image}
										alt=""
										loading="lazy"
										className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
									/>
									{/* Bottom gradient */}
									<div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-950/80 to-transparent" />
								</div>

								{/* Content */}
								<div className="p-6">
									<div className="flex items-center gap-3">
										<span
											className={cn(
												"rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ring-1 ring-inset",
												TAG_COLORS[post.tag] ?? "bg-white/10 text-white/60 ring-white/20",
											)}
										>
											{t(`blogPage.tags.${post.tag}`)}
										</span>
										<span className="text-[11px] text-white/30">
											{formatDate(post.date)}
										</span>
									</div>
									<h3 className="mt-4 text-lg font-bold leading-snug text-white">
										{t(`blogPage.posts.${post.key}.title`)}
									</h3>
									<p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-white/40">
										{t(`blogPage.posts.${post.key}.excerpt`)}
									</p>
									<div className="mt-5">
										<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f97505] transition-colors group-hover:text-[#ffb060]">
											{t("blogPage.readMore")}
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
												<path d="M5 12h14"/>
												<path d="m12 5 7 7-7 7"/>
											</svg>
										</span>
									</div>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
