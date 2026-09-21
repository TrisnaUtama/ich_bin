import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowUpRightIcon } from "#/components/ui/icons";
import { templatesShowcase } from "#/content/site";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

type ShowcaseItem = (typeof templatesShowcase)[number];

/** Per-card accent colors for the tag badges */
const TAG_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
	Distortion: { bg: "bg-[#ff6a3a]/15", text: "text-[#ff9a6a]", ring: "ring-[#ff6a3a]/30" },
	Typography: { bg: "bg-[#3ae4ff]/15", text: "text-[#6aefff]", ring: "ring-[#3ae4ff]/30" },
	Photoshop: { bg: "bg-[#c23bd6]/15", text: "text-[#d97ce8]", ring: "ring-[#c23bd6]/30" },
	Glitch: { bg: "bg-[#00ffaa]/15", text: "text-[#66ffcc]", ring: "ring-[#00ffaa]/30" },
	Duotone: { bg: "bg-[#e8d5b7]/15", text: "text-[#e8d5b7]", ring: "ring-[#e8d5b7]/30" },
	Print: { bg: "bg-[#ffcc44]/15", text: "text-[#ffdd77]", ring: "ring-[#ffcc44]/30" },
	Film: { bg: "bg-[#d4c4a0]/15", text: "text-[#d4c4a0]", ring: "ring-[#d4c4a0]/30" },
	Neon: { bg: "bg-[#ff00ff]/15", text: "text-[#ff66ff]", ring: "ring-[#ff00ff]/30" },
	Retro: { bg: "bg-[#00ff88]/15", text: "text-[#66ffaa]", ring: "ring-[#00ff88]/30" },
	Surreal: { bg: "bg-[#c8a0ff]/15", text: "text-[#d4b8ff]", ring: "ring-[#c8a0ff]/30" },
	Bold: { bg: "bg-white/15", text: "text-white/85", ring: "ring-white/25" },
	/* i18n fallbacks */
	Verzerrung: { bg: "bg-[#ff6a3a]/15", text: "text-[#ff9a6a]", ring: "ring-[#ff6a3a]/30" },
	Tipografi: { bg: "bg-[#3ae4ff]/15", text: "text-[#6aefff]", ring: "ring-[#3ae4ff]/30" },
	Distorsi: { bg: "bg-[#ff6a3a]/15", text: "text-[#ff9a6a]", ring: "ring-[#ff6a3a]/30" },
	Cetak: { bg: "bg-[#ffcc44]/15", text: "text-[#ffdd77]", ring: "ring-[#ffcc44]/30" },
	Tegas: { bg: "bg-white/15", text: "text-white/85", ring: "ring-white/25" },
	Fett: { bg: "bg-white/15", text: "text-white/85", ring: "ring-white/25" },
	Druck: { bg: "bg-[#ffcc44]/15", text: "text-[#ffdd77]", ring: "ring-[#ffcc44]/30" },
	Typografie: { bg: "bg-[#3ae4ff]/15", text: "text-[#6aefff]", ring: "ring-[#3ae4ff]/30" },
};

const DEFAULT_TAG = { bg: "bg-white/10", text: "text-white/70", ring: "ring-white/15" };

function TemplateCard({
	item,
	className,
}: {
	item: ShowcaseItem;
	className?: string;
}) {
	const { t } = useTranslation();
	const isReal = Boolean(item.templateId);
	const tag = t(`templates.${item.key}.tag`);
	const title = t(`templates.${item.key}.title`);
	const description = t(`templates.${item.key}.description`);
	const tagColor = TAG_COLORS[tag] ?? DEFAULT_TAG;

	const content = (
		<div
			data-template-card
			className={cn(
				"group relative isolate flex flex-col overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-inset ring-white/10 transition-shadow duration-300",
				isReal && "cursor-pointer hover:ring-primary-500/60",
				className,
			)}
		>
			{/* Gradient background */}
			<div
				aria-hidden
				className={cn(
					"absolute inset-0 bg-linear-to-br opacity-80 transition-transform duration-500 group-hover:scale-105",
					item.accent,
				)}
			/>
			{/* Dark overlay for readability */}
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.05)_0%,rgba(8,8,10,0.25)_40%,rgba(8,8,10,0.88)_100%)]" />
			<div className="grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />

			{/* Spacer — pushes content to bottom */}
			<div className="flex-1" />

			{/* Bottom content: badges above title */}
			<div className="relative z-10 p-5">
				{/* Tag badges */}
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

				{/* Title + description + arrow */}
				<div className="flex items-end justify-between gap-4">
					<div className="min-w-0 flex-1">
						<h3 className="text-base font-semibold leading-snug text-white sm:text-lg">
							{title}
						</h3>
						<p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-white/55">
							{description}
						</p>
					</div>
					{isReal && (
						<span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white shadow-[0_6px_20px_-4px_rgba(238,61,11,0.6)] transition-transform duration-200 group-hover:scale-110">
							<ArrowUpRightIcon className="size-4" />
						</span>
					)}
				</div>
			</div>
		</div>
	);

	if (!isReal || !item.templateId) return content;

	return (
		<Link
			to="/editor"
			search={{ template: item.templateId }}
			className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
		>
			{content}
		</Link>
	);
}

export function TemplatesSection() {
	const { t } = useTranslation();
	const sectionRef = useRef<HTMLElement>(null);

	/* 3-2-3 layout */
	const row1 = templatesShowcase.slice(0, 3);
	const row2 = templatesShowcase.slice(3, 5);
	const row3 = templatesShowcase.slice(5, 8);

	useGSAP(
		() => {
			gsap.from("[data-templates-reveal]", {
				y: 24,
				opacity: 0,
				duration: 0.8,
				ease: EASE.expo,
				stagger: 0.08,
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 78%",
				},
			});
		},
		{ scope: sectionRef },
	);

	return (
		<section
			id="templates"
			ref={sectionRef}
			className="relative overflow-hidden bg-ink-950 px-6 py-24 sm:px-10 sm:py-28 lg:px-20"
		>
			{/* ── Silhouette glow top-right ── */}
			<div
				aria-hidden
				className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full opacity-25 blur-[160px]"
				style={{
					background:
						"radial-gradient(circle, #D73F18 0%, #300112 80%, transparent 100%)",
				}}
			/>

			<div className="relative mx-auto max-w-[1320px]">
				{/* ── Header ── */}
				<div data-templates-reveal className="mx-auto max-w-2xl text-center">
					<span className="inline-flex items-center rounded-full bg-primary-500/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-400 ring-1 ring-inset ring-primary-500/30">
						{t("templatesSection.badge")}
					</span>
					<h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.6rem]">
						{t("templatesSection.heading")}
					</h2>
					<p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
						{t("templatesSection.subheading")}
					</p>
				</div>

				{/* ── Grid: 3 – 2 – 3 ── */}
				<div className="mt-14 space-y-5 sm:mt-16">
					{/* Row 1: 3 equal cards */}
					<div
						data-templates-reveal
						className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
					>
						{row1.map((item) => (
							<TemplateCard
								key={item.key}
								item={item}
								className="h-[446px]"
							/>
						))}
					</div>

					{/* Row 2: 2 wider cards */}
					<div
						data-templates-reveal
						className="grid grid-cols-1 gap-5 sm:grid-cols-2"
					>
						{row2.map((item) => (
							<TemplateCard
								key={item.key}
								item={item}
								className="h-[446px]"
							/>
						))}
					</div>

					{/* Row 3: 3 equal cards */}
					<div
						data-templates-reveal
						className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
					>
						{row3.map((item) => (
							<TemplateCard
								key={item.key}
								item={item}
								className="h-[446px]"
							/>
						))}
					</div>
				</div>

			</div>
		</section>
	);
}
