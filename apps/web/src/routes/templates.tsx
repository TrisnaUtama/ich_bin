import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "#/components/layout/page-header";
import { SiteFooter } from "#/components/layout/site-footer";
import { ArrowUpRightIcon } from "#/components/ui/icons";
import { templatesShowcase } from "#/content/site";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, pressable, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

export const Route = createFileRoute("/templates")({
	component: TemplatesPage,
});

type TemplateItem = (typeof templatesShowcase)[number];

const TAG_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
	Distortion: {
		bg: "bg-[#ff6a3a]/15",
		text: "text-[#ff9a6a]",
		ring: "ring-[#ff6a3a]/30",
	},
	Typography: {
		bg: "bg-[#3ae4ff]/15",
		text: "text-[#6aefff]",
		ring: "ring-[#3ae4ff]/30",
	},
	Photoshop: {
		bg: "bg-[#c23bd6]/15",
		text: "text-[#d97ce8]",
		ring: "ring-[#c23bd6]/30",
	},
	Glitch: {
		bg: "bg-[#00ffaa]/15",
		text: "text-[#66ffcc]",
		ring: "ring-[#00ffaa]/30",
	},
	Duotone: {
		bg: "bg-[#e8d5b7]/15",
		text: "text-[#e8d5b7]",
		ring: "ring-[#e8d5b7]/30",
	},
	Print: {
		bg: "bg-[#ffcc44]/15",
		text: "text-[#ffdd77]",
		ring: "ring-[#ffcc44]/30",
	},
	Film: {
		bg: "bg-[#d4c4a0]/15",
		text: "text-[#d4c4a0]",
		ring: "ring-[#d4c4a0]/30",
	},
	Neon: {
		bg: "bg-[#ff00ff]/15",
		text: "text-[#ff66ff]",
		ring: "ring-[#ff00ff]/30",
	},
	Retro: {
		bg: "bg-[#00ff88]/15",
		text: "text-[#66ffaa]",
		ring: "ring-[#00ff88]/30",
	},
	Surreal: {
		bg: "bg-[#c8a0ff]/15",
		text: "text-[#d4b8ff]",
		ring: "ring-[#c8a0ff]/30",
	},
	Bold: { bg: "bg-white/15", text: "text-white/85", ring: "ring-white/25" },
	/* i18n fallbacks */
	Verzerrung: {
		bg: "bg-[#ff6a3a]/15",
		text: "text-[#ff9a6a]",
		ring: "ring-[#ff6a3a]/30",
	},
	Tipografi: {
		bg: "bg-[#3ae4ff]/15",
		text: "text-[#6aefff]",
		ring: "ring-[#3ae4ff]/30",
	},
	Distorsi: {
		bg: "bg-[#ff6a3a]/15",
		text: "text-[#ff9a6a]",
		ring: "ring-[#ff6a3a]/30",
	},
	Cetak: {
		bg: "bg-[#ffcc44]/15",
		text: "text-[#ffdd77]",
		ring: "ring-[#ffcc44]/30",
	},
	Tegas: { bg: "bg-white/15", text: "text-white/85", ring: "ring-white/25" },
	Fett: { bg: "bg-white/15", text: "text-white/85", ring: "ring-white/25" },
	Druck: {
		bg: "bg-[#ffcc44]/15",
		text: "text-[#ffdd77]",
		ring: "ring-[#ffcc44]/30",
	},
	Typografie: {
		bg: "bg-[#3ae4ff]/15",
		text: "text-[#6aefff]",
		ring: "ring-[#3ae4ff]/30",
	},
};

const DEFAULT_TAG = {
	bg: "bg-white/10",
	text: "text-white/70",
	ring: "ring-white/15",
};

const ALL_TAGS = [
	"all",
	"Distortion",
	"Typography",
	"Photoshop",
	"Glitch",
	"Duotone",
	"Print",
	"Film",
	"Neon",
	"Retro",
	"Surreal",
	"Bold",
] as const;

function TemplateCard({ item }: { item: TemplateItem }) {
	const { t } = useTranslation();
	const tag = t(`templates.${item.key}.tag`);
	const title = t(`templates.${item.key}.title`);
	const description = t(`templates.${item.key}.description`);
	const tagColor = TAG_COLORS[tag] ?? DEFAULT_TAG;
	const isReal = Boolean(item.templateId);

	const inner = (
		<div className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-inset ring-white/10 transition-all duration-300 hover:ring-primary-500/50 hover:shadow-[0_8px_40px_-12px_rgba(238,61,11,0.3)]">
			{/* Gradient bg */}
			<div
				aria-hidden
				className={cn(
					"absolute inset-0 bg-linear-to-br opacity-80 transition-transform duration-700 group-hover:scale-110",
					item.accent,
				)}
			/>
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.05)_0%,rgba(8,8,10,0.25)_40%,rgba(8,8,10,0.9)_100%)]" />
			<div className="grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />

			{/* Spacer */}
			<div className="flex-1" />

			{/* Content */}
			<div className="relative z-10 p-6">
				<div className="mb-3 flex flex-wrap items-center gap-2">
					<span
						className={cn(
							"inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset backdrop-blur-sm",
							tagColor.bg,
							tagColor.text,
							tagColor.ring,
						)}
					>
						{tag}
					</span>
					{!isReal && (
						<span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/60 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
							{t("templatesSection.comingSoon")}
						</span>
					)}
				</div>
				<h3 className="text-lg font-bold leading-snug text-white sm:text-xl">
					{title}
				</h3>
				<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/55">
					{description}
				</p>

				<div className="mt-4 flex items-center gap-3">
					{isReal ? (
						<span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-400 transition-colors group-hover:text-primary-300">
							{t("templatesPage.viewDetails")}
							<ArrowUpRightIcon className="size-3.5" />
						</span>
					) : (
						<span className="text-sm font-medium text-white/40">
							{t("templatesSection.comingSoon")}
						</span>
					)}
				</div>
			</div>
		</div>
	);

	if (!isReal || !item.templateId) {
		return <div className="h-[380px] sm:h-[420px]">{inner}</div>;
	}

	return (
		<Link
			to="/templates/$slug"
			params={{ slug: item.templateId }}
			className="block h-[380px] rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 sm:h-[420px]"
		>
			{inner}
		</Link>
	);
}

function TemplatesPage() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();
	const [filter, setFilter] = useState("all");

	useEffect(() => {
		document.title = "Templates — ZINEFORGE";
	}, []);

	useGSAP(
		() => {
			gsap.from("[data-tpl-reveal]", {
				y: 32,
				opacity: 0,
				duration: 0.9,
				ease: EASE.expo,
				stagger: 0.06,
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 80%",
				},
			});
		},
		{ scope: sectionRef },
	);

	/* filter by tag (English key) */
	const filtered =
		filter === "all"
			? templatesShowcase
			: templatesShowcase.filter((item) => {
					const tag = t(`templates.${item.key}.tag`);
					return tag === filter || TAG_COLORS[tag] === TAG_COLORS[filter];
				});

	return (
		<main className="relative min-h-svh bg-ink-950">
			<PageHeader />

			<div ref={sectionRef} className="relative px-5 pb-20 sm:px-10 lg:px-20">
				{/* Ambient glow */}
				<div
					aria-hidden
					className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full opacity-25 blur-[160px]"
					style={{
						background:
							"radial-gradient(circle, #D73F18 0%, #300112 80%, transparent 100%)",
					}}
				/>

				<div className="relative mx-auto max-w-[1440px]">
					{/* Header */}
					<div data-tpl-reveal className="mx-auto max-w-2xl text-center">
						<span className="inline-flex items-center rounded-full bg-primary-500/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-400 ring-1 ring-inset ring-primary-500/30">
							{t("templatesPage.badge")}
						</span>
						<h1 className="mt-5 text-4xl font-extrabold uppercase leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
							{t("templatesPage.heading")}
						</h1>
						<p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
							{t("templatesPage.subheading")}
						</p>
					</div>

					{/* Stats row */}
					<div
						data-tpl-reveal
						className="mt-10 flex items-center justify-center gap-6 sm:gap-10"
					>
						<div className="text-center">
							<p className="text-2xl font-bold text-white">11</p>
							<p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-white/40">
								{t("templatesPage.statsTemplates")}
							</p>
						</div>
						<div className="h-6 w-px bg-white/10" />
						<div className="text-center">
							<p className="text-2xl font-bold text-white">7</p>
							<p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-white/40">
								{t("templatesPage.statsCategories")}
							</p>
						</div>
						<div className="h-6 w-px bg-white/10" />
						<div className="text-center">
							<p className="text-2xl font-bold text-primary-400">Free</p>
							<p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-white/40">
								{t("templatesPage.statsStarting")}
							</p>
						</div>
					</div>

					{/* Grid */}
					<div
						data-tpl-reveal
						className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3"
					>
						{templatesShowcase.map((item) => (
							<TemplateCard key={item.key} item={item} />
						))}
					</div>
				</div>
			</div>

			<SiteFooter />
		</main>
	);
}
