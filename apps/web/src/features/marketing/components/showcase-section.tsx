import { motion } from "motion/react";
import { useRef } from "react";
import { ArrowUpRightIcon } from "#/components/ui/icons";
import { hero, type ShowcaseItem, showcaseGallery } from "#/content/site";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, pressable, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

type ShowcaseColumn = ShowcaseItem[];

// Card heights alternate tall/short per column for a brick-like masonry rhythm.
const TALL_HEIGHT = 360;
const SHORT_HEIGHT = 220;

// Alternating direction per column creates the parallax "waterfall" feel.
const COLUMN_DIRECTION: readonly (1 | -1)[] = [1, -1, 1, -1, 1];
// Slightly different speeds per column so the loops never feel mechanical.
const COLUMN_DURATION: readonly number[] = [52, 64, 46, 70, 56];
// Progressively hide columns on smaller viewports (rendered left → right).
const COLUMN_VISIBILITY: readonly string[] = [
	"flex",
	"flex",
	"hidden sm:flex",
	"hidden lg:flex",
	"hidden lg:flex",
];

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
	if (item.kind === "poster") {
		return (
			<div
				className={cn(
					"relative flex h-full flex-col justify-end overflow-hidden rounded-xl bg-linear-to-br p-5 ring-1 ring-inset ring-white/10",
					item.accent,
				)}
			>
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.55)_100%)]" />
				<div className="grain absolute inset-0 opacity-[0.14] mix-blend-overlay" />
				<div className="relative z-10">
					<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
						{item.tag}
					</p>
					<p className="mt-1.5 text-lg font-bold leading-tight tracking-tight text-white">
						{item.title}
					</p>
					<p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-white/50">
						{item.subtitle}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative h-full overflow-hidden rounded-xl ring-1 ring-inset ring-white/[0.08]">
			<img
				src={item.src}
				alt=""
				loading="lazy"
				draggable={false}
				className={cn(
					"h-full w-full select-none object-cover transition-transform duration-700 ease-out hover:scale-105",
					item.grayscale && "grayscale",
				)}
			/>
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0)_0%,rgba(8,8,10,0.25)_100%)]" />
		</div>
	);
}

function MarqueeColumn({
	items,
	columnIndex,
	direction,
	duration,
	className,
}: {
	items: ShowcaseColumn;
	columnIndex: number;
	direction: 1 | -1;
	duration: number;
	className?: string;
}) {
	const trackRef = useRef<HTMLDivElement>(null);
	const tweenRef = useRef<gsap.core.Tween | null>(null);

	useGSAP(() => {
		const track = trackRef.current;
		if (!track) return;

		gsap.set(track, { yPercent: direction === 1 ? 0 : -50 });
		tweenRef.current = gsap.to(track, {
			yPercent: direction === 1 ? -50 : 0,
			duration,
			ease: "none",
			repeat: -1,
		});

		return () => {
			tweenRef.current?.kill();
		};
	}, [direction, duration]);

	const handleEnter = () => {
		tweenRef.current?.timeScale(0.1);
		gsap.to(trackRef.current, {
			filter: "blur(0px)",
			duration: 0.45,
			ease: EASE.soft,
		});
	};

	const handleLeave = () => {
		tweenRef.current?.timeScale(1);
		gsap.to(trackRef.current, {
			filter: "blur(0.6px)",
			duration: 0.55,
			ease: EASE.soft,
		});
	};

	return (
		<div
			className={cn("relative h-full flex-1 overflow-hidden", className)}
			onPointerEnter={handleEnter}
			onPointerLeave={handleLeave}
		>
			<div
				ref={trackRef}
				className="flex flex-col gap-4 will-change-transform"
				style={{ filter: "blur(0.6px)" }}
			>
				{[...items, ...items].map((item, index) => {
					const isTall = (columnIndex + index) % 2 === 0;
					const height = isTall ? TALL_HEIGHT : SHORT_HEIGHT;
					return (
						<div
							key={`${item.key}-${index}`}
							style={{ height: `${height}px` }}
							className="shrink-0"
						>
							<ShowcaseCard item={item} />
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function ShowcaseSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const { t } = useTranslation();

	useGSAP(
		() => {
			gsap.from("[data-showcase-reveal]", {
				y: 24,
				opacity: 0,
				duration: 0.8,
				ease: EASE.expo,
				stagger: 0.08,
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 80%",
				},
			});

			gsap.from("[data-showcase-column]", {
				y: 60,
				opacity: 0,
				duration: 1,
				ease: EASE.expo,
				stagger: 0.07,
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 70%",
				},
			});
		},
		{ scope: sectionRef },
	);

	return (
		<section
			id="showcase"
			ref={sectionRef}
			className="relative overflow-hidden bg-ink-950 px-5 py-20 sm:px-10 sm:py-28 lg:px-20"
		>
			{/* ── ambient glow: warm gradient blobs ── */}
			<div
				aria-hidden
				className="pointer-events-none absolute -left-40 -top-48 h-[700px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,#ff4d0080_0%,#ff6a1a40_40%,transparent_70%)] opacity-80 blur-[120px]"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -right-40 -top-48 h-[700px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,#ed421680_0%,#ec692940_40%,transparent_70%)] opacity-80 blur-[120px]"
			/>
			{/* Bottom warm glow for the bottom edge */}
			<div
				aria-hidden
				className="pointer-events-none absolute -bottom-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,#ff4d0040_0%,transparent_70%)] opacity-60 blur-[100px]"
			/>

			<div className="relative mx-auto max-w-[1440px]">
				{/* ── header row ── */}
				<div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
					<div data-showcase-reveal className="max-w-xl">
						<span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-400 backdrop-blur-sm">
							{t("showcaseSection.badge")}
						</span>
						<h2 className="mt-6 text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem]">
							{t("showcaseSection.heading")}
						</h2>
						<p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/50 sm:text-base">
							{t("showcaseSection.subheading")}
						</p>
					</div>

					<motion.div data-showcase-reveal {...pressable} className="shrink-0">
						<a
							href={hero.actions.secondary.href}
							className="inline-flex items-center gap-2.5 rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/90 hover:bg-white/10"
						>
							{t("showcaseSection.cta")}
							<ArrowUpRightIcon className="size-4" />
						</a>
					</motion.div>
				</div>

				{/* ── masonry gallery grid ── */}
				<div className="relative mt-12 sm:mt-16">
					{/* Top fade mask */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-ink-950 to-transparent"
					/>
					{/* Bottom fade mask */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-ink-950 to-transparent"
					/>

					<div className="flex h-[560px] gap-4 overflow-hidden sm:h-[640px] lg:h-[720px]">
						{showcaseGallery.map((column, index) => (
							<div
								key={index}
								data-showcase-column
								className={cn("h-full flex-1", COLUMN_VISIBILITY[index])}
							>
								<MarqueeColumn
									items={column}
									columnIndex={index}
									direction={COLUMN_DIRECTION[index % COLUMN_DIRECTION.length]}
									duration={COLUMN_DURATION[index % COLUMN_DURATION.length]}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
