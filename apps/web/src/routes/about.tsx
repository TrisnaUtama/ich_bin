import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { PageHeader } from "#/components/layout/page-header";
import { SiteFooter } from "#/components/layout/site-footer";
import { brand } from "#/content/site";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

export const Route = createFileRoute("/about")({ component: AboutPage });

const VALUES = [
	{
		icon: (
			<svg
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
			</svg>
		),
		key: "craft",
	},
	{
		icon: (
			<svg
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
				<path d="M2 12h20" />
				<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
			</svg>
		),
		key: "access",
	},
	{
		icon: (
			<svg
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
				<path d="M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>
		),
		key: "community",
	},
	{
		icon: (
			<svg
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polyline points="13 17 18 12 13 7" />
				<polyline points="6 17 11 12 6 7" />
			</svg>
		),
		key: "innovation",
	},
];

const STATS = [
	{ value: "10K+", key: "users" },
	{ value: "50+", key: "templates" },
	{ value: "3", key: "languages" },
	{ value: "∞", key: "creativity" },
];

function AboutPage() {
	const sectionRef = useRef<HTMLElement>(null);
	const { t } = useTranslation();

	useGSAP(
		() => {
			gsap.from("[data-about-reveal]", {
				y: 40,
				opacity: 0,
				duration: 0.9,
				ease: EASE.expo,
				stagger: 0.08,
			});
		},
		{ scope: sectionRef },
	);

	useEffect(() => {
		document.title = "About Us — ZINEFORGE";
	}, []);

	return (
		<main ref={sectionRef} className="relative min-h-svh bg-ink-950">
			<PageHeader />

			{/* ── Hero ── */}
			<section className="px-6 pb-20 sm:px-10 lg:px-20">
				<div className="mx-auto max-w-[1320px]">
					{/* Badge */}
					<span
						data-about-reveal
						className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60"
					>
						{t("aboutPage.badge")}
					</span>

					{/* Big heading */}
					<h1
						data-about-reveal
						className="mt-8 max-w-4xl text-4xl font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl xl:text-7xl"
					>
						{t("aboutPage.heroTitle")}
					</h1>

					<p
						data-about-reveal
						className="mt-6 max-w-2xl text-lg leading-relaxed text-white/50 sm:text-xl"
					>
						{t("aboutPage.heroDescription")}
					</p>
				</div>
			</section>

			{/* ── Stats bar ── */}
			<section className="border-y border-white/[0.06] bg-white/[0.015] px-6 sm:px-10 lg:px-20">
				<div className="mx-auto grid max-w-[1320px] grid-cols-2 lg:grid-cols-4">
					{STATS.map((stat, i) => (
						<div
							key={stat.key}
							data-about-reveal
							className={cn(
								"flex flex-col items-center justify-center py-10 sm:py-14",
								i < STATS.length - 1 && "border-r border-white/[0.06]",
							)}
						>
							<span className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
								{stat.value}
							</span>
							<span className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-white/40">
								{t(`aboutPage.stats.${stat.key}`)}
							</span>
						</div>
					))}
				</div>
			</section>

			{/* ── Story section ── */}
			<section className="px-6 py-24 sm:px-10 lg:px-20">
				<div className="mx-auto max-w-[1320px]">
					<div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
						{/* Left — visual card */}
						<div data-about-reveal className="relative">
							<div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#f97505] via-[#e85a10] to-[#d83a10]">
								<div className="grain pointer-events-none absolute inset-0 z-10 opacity-[0.06] mix-blend-overlay" />
								<div className="relative px-10 py-16 sm:px-14 sm:py-20">
									<span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
										{t("aboutPage.storyBadge")}
									</span>
									<h2 className="mt-4 text-3xl font-extrabold uppercase leading-[1.1] text-white sm:text-4xl">
										{t("aboutPage.storyHeading")}
									</h2>
									{/* Decorative circles */}
									<div className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-white/[0.06]" />
									<div className="pointer-events-none absolute -top-10 -left-10 size-40 rounded-full bg-white/[0.04]" />
								</div>
							</div>
						</div>

						{/* Right — story text */}
						<div data-about-reveal className="flex flex-col justify-center">
							<p className="text-[15px] leading-[1.8] text-white/55">
								{t("aboutPage.storyP1")}
							</p>
							<p className="mt-6 text-[15px] leading-[1.8] text-white/55">
								{t("aboutPage.storyP2")}
							</p>
							<p className="mt-6 text-[15px] leading-[1.8] text-white/55">
								{t("aboutPage.storyP3")}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Values ── */}
			<section className="bg-white/[0.015] px-6 py-24 sm:px-10 lg:px-20">
				<div className="mx-auto max-w-[1320px]">
					<div className="text-center">
						<span
							data-about-reveal
							className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60"
						>
							{t("aboutPage.valuesBadge")}
						</span>
						<h2
							data-about-reveal
							className="mt-6 text-3xl font-extrabold uppercase tracking-[-0.01em] text-white sm:text-4xl"
						>
							{t("aboutPage.valuesHeading")}
						</h2>
					</div>

					<div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{VALUES.map((val) => (
							<div
								key={val.key}
								data-about-reveal
								className="group rounded-2xl border border-white/[0.06] bg-ink-950 p-8 transition-colors duration-300 hover:border-white/[0.12] hover:bg-white/[0.02]"
							>
								<div className="inline-flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97505]/20 to-[#d83a10]/20 text-[#f97505] ring-1 ring-inset ring-[#f97505]/20 transition-colors group-hover:from-[#f97505]/30 group-hover:to-[#d83a10]/30">
									{val.icon}
								</div>
								<h3 className="mt-5 text-base font-bold text-white">
									{t(`aboutPage.values.${val.key}.title`)}
								</h3>
								<p className="mt-2.5 text-sm leading-relaxed text-white/45">
									{t(`aboutPage.values.${val.key}.description`)}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── CTA ── */}
			<section className="px-6 py-24 sm:px-10 lg:px-20">
				<div className="mx-auto max-w-[1320px]">
					<div
						data-about-reveal
						className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f97505] via-[#e85a10] to-[#d83a10] px-8 py-16 text-center sm:px-16 sm:py-20"
					>
						<div className="grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" />
						<div className="relative z-10">
							<h2 className="text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
								{t("aboutPage.ctaTitle")}
							</h2>
							<p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/70">
								{t("aboutPage.ctaDescription")}
							</p>
							<Link
								to="/"
								hash="templates"
								className="primary-gradient mt-8 inline-flex items-center rounded-full bg-white px-8 py-3.5 text-sm font-bold text-ink-950 shadow-[0_14px_34px_-14px_rgba(0,0,0,0.4)] transition-transform active:scale-[0.97]"
							>
								{t("aboutPage.ctaButton")}
							</Link>
						</div>
						{/* Decorative */}
						<div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-white/[0.06]" />
						<div className="pointer-events-none absolute -bottom-16 -left-16 size-60 rounded-full bg-white/[0.04]" />
					</div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
