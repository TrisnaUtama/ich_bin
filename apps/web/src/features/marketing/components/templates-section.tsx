import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useRef } from "react";
import { ArrowUpRightIcon } from "#/components/ui/icons";
import { templatesShowcase } from "#/content/site";
import { DEFAULT_TEMPLATE } from "#/engine/templateList";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, pressable, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

type ShowcaseItem = (typeof templatesShowcase)[number];

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

	const content = (
		<div
			data-template-card
			className={cn(
				"group relative isolate flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl bg-ink-800 p-5 ring-1 ring-inset ring-white/10 transition-shadow duration-300",
				isReal && "cursor-pointer hover:ring-primary-500/60",
				className,
			)}
		>
			<div
				aria-hidden
				className={cn(
					"absolute inset-0 bg-linear-to-br opacity-80 transition-transform duration-500 group-hover:scale-105",
					item.accent,
				)}
			/>
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.05)_0%,rgba(8,8,10,0.35)_55%,rgba(8,8,10,0.92)_100%)]" />
			<div className="grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />

			<div className="relative z-10 flex items-start justify-between gap-2">
				<span className="inline-flex items-center rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white/85 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
					{tag}
				</span>
				{!isReal && (
					<span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/70 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
						{t("templatesSection.comingSoon")}
					</span>
				)}
			</div>

			<div className="relative z-10 mt-auto">
				<h3 className="text-lg font-semibold leading-snug text-white sm:text-xl">
					{title}
				</h3>
				<p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/70">
					{description}
				</p>
			</div>

			{isReal && (
				<span className="absolute bottom-5 right-5 z-10 inline-flex size-9 items-center justify-center rounded-full bg-primary-500 text-white opacity-0 shadow-[0_8px_24px_-8px_rgba(238,61,11,0.8)] transition-all duration-300 group-hover:opacity-100">
					<ArrowUpRightIcon className="size-4" />
				</span>
			)}
		</div>
	);

	if (!isReal || !item.templateId) return content;

	return (
		<Link
			to="/editor"
			search={{ template: item.templateId }}
			className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-2xl"
		>
			{content}
		</Link>
	);
}

export function TemplatesSection() {
	const { t } = useTranslation();
	const sectionRef = useRef<HTMLElement>(null);
	const [row1, row2, row3] = [
		templatesShowcase.slice(0, 3),
		templatesShowcase.slice(3, 5),
		templatesShowcase.slice(5, 8),
	];

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
			className="relative bg-ink-950 px-6 py-24 sm:px-10 sm:py-28 lg:px-23"
		>
			<div className="mx-auto max-w-[1600px]">
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

				<div className="mt-14 space-y-5 sm:mt-16">
					<div
						data-templates-reveal
						className="grid grid-cols-1 gap-5 sm:grid-cols-3"
					>
						{row1.map((item) => (
							<TemplateCard key={item.key} item={item} />
						))}
					</div>

					<div
						data-templates-reveal
						className="grid grid-cols-1 gap-5 sm:grid-cols-12"
					>
						<TemplateCard item={row2[0]} className="sm:col-span-5" />
						<TemplateCard item={row2[1]} className="sm:col-span-7" />
					</div>

					<div
						data-templates-reveal
						className="grid grid-cols-1 gap-5 sm:grid-cols-3"
					>
						{row3.map((item) => (
							<TemplateCard key={item.key} item={item} />
						))}
					</div>
				</div>

				<div data-templates-reveal className="mt-12 flex justify-center">
					<motion.div {...pressable}>
						<Link
							to="/editor"
							search={{ template: DEFAULT_TEMPLATE }}
							className="primary-gradient inline-flex items-center justify-center rounded-2xl px-9 py-4 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-white/10"
						>
							{t("templatesSection.useTemplate")}
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
