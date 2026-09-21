import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "#/components/layout/page-header";
import { SiteFooter } from "#/components/layout/site-footer";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

export const Route = createFileRoute("/showcase")({ component: ShowcasePage });

/* ── Gallery data ───────────────────────────────────────────── */
const SHOWCASE_ITEMS = [
	{
		key: "sc1",
		src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=1000&fit=crop&q=80",
		span: "row-span-2",
	},
	{
		key: "sc2",
		src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc3",
		src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc4",
		src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&q=80",
		span: "row-span-2",
	},
	{
		key: "sc5",
		src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc6",
		src: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc7",
		src: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&h=1000&fit=crop&q=80",
		span: "row-span-2",
	},
	{
		key: "sc8",
		src: "https://images.unsplash.com/photo-1522444195799-478538b28823?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc9",
		src: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc10",
		src: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1000&fit=crop&q=80",
		span: "row-span-2",
	},
	{
		key: "sc11",
		src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc12",
		src: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc13",
		src: "https://images.unsplash.com/photo-1551893478-d60cc920032e?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc14",
		src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop&q=80",
		span: "row-span-2",
	},
	{
		key: "sc15",
		src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc16",
		src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc17",
		src: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&h=600&fit=crop&q=80",
		span: "",
	},
	{
		key: "sc18",
		src: "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800&h=1000&fit=crop&q=80",
		span: "row-span-2",
	},
] as const;

const CATEGORIES = [
	"all",
	"poster",
	"typography",
	"glitch",
	"portrait",
	"abstract",
] as const;

/* ── Lightbox ───────────────────────────────────────────────── */
function Lightbox({
	src,
	onClose,
	onPrev,
	onNext,
}: {
	src: string;
	onClose: () => void;
	onPrev: () => void;
	onNext: () => void;
}) {
	const handleKey = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") onPrev();
			if (e.key === "ArrowRight") onNext();
		},
		[onClose, onPrev, onNext],
	);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKey);
		};
	}, [handleKey]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.25 }}
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
			onClick={onClose}
		>
			{/* Close */}
			<button
				type="button"
				onClick={onClose}
				className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 hover:text-white sm:right-6 sm:top-6"
				aria-label="Close"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-5"
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
			</button>

			{/* Prev */}
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					onPrev();
				}}
				className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 hover:text-white sm:left-6 sm:size-12"
				aria-label="Previous"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-5"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
			</button>

			{/* Next */}
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					onNext();
				}}
				className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 hover:text-white sm:right-6 sm:size-12"
				aria-label="Next"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-5"
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			</button>

			{/* Image */}
			<motion.img
				key={src}
				initial={{ scale: 0.92, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.92, opacity: 0 }}
				transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
				src={src}
				alt=""
				draggable={false}
				onClick={(e) => e.stopPropagation()}
				className="max-h-[85vh] max-w-[90vw] select-none rounded-2xl object-contain shadow-2xl sm:max-w-[80vw]"
			/>

			{/* Indicator: view only */}
			<div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/60 ring-1 ring-white/15 backdrop-blur-sm sm:bottom-6">
				Gallery view only
			</div>
		</motion.div>
	);
}

/* ── Page ────────────────────────────────────────────────────── */
function ShowcasePage() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();
	const [activeFilter, setActiveFilter] = useState<string>("all");
	const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

	useEffect(() => {
		document.title = "Showcase — ZINEFORGE";
	}, []);

	useGSAP(
		() => {
			gsap.from("[data-sc-reveal]", {
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

	const openLightbox = (idx: number) => setLightboxIdx(idx);
	const closeLightbox = () => setLightboxIdx(null);
	const goPrev = () =>
		setLightboxIdx((i) =>
			i !== null
				? (i - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length
				: null,
		);
	const goNext = () =>
		setLightboxIdx((i) =>
			i !== null ? (i + 1) % SHOWCASE_ITEMS.length : null,
		);

	return (
		<main className="relative min-h-svh bg-ink-950">
			<PageHeader />

			<div ref={sectionRef} className="relative px-5 pb-20 sm:px-10 lg:px-20">
				{/* Ambient glows */}
				<div
					aria-hidden
					className="pointer-events-none absolute -left-40 -top-48 h-[700px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,#ff4d0060_0%,#ff6a1a30_40%,transparent_70%)] opacity-80 blur-[120px]"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute -right-40 -top-48 h-[700px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,#ed421660_0%,#ec692920_40%,transparent_70%)] opacity-80 blur-[120px]"
				/>

				<div className="relative mx-auto max-w-[1440px]">
					{/* Header */}
					<div data-sc-reveal className="mx-auto max-w-2xl text-center">
						<span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-400 backdrop-blur-sm">
							{t("showcasePage.badge")}
						</span>
						<h1 className="mt-6 text-4xl font-extrabold uppercase leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
							{t("showcasePage.heading")}
						</h1>
						<p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
							{t("showcasePage.subheading")}
						</p>
					</div>

					{/* Filter tabs */}
					<div
						data-sc-reveal
						className="mt-10 flex flex-wrap justify-center gap-2 sm:mt-12"
					>
						{CATEGORIES.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setActiveFilter(cat)}
								className={cn(
									"rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-300",
									activeFilter === cat
										? "bg-primary-500 text-white shadow-[0_4px_20px_-4px_rgba(238,61,11,0.5)]"
										: "bg-white/[0.06] text-white/60 ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-white/80",
								)}
							>
								{t(`showcasePage.filters.${cat}`)}
							</button>
						))}
					</div>

					{/* Masonry grid */}
					<div className="mt-10 columns-2 gap-4 sm:mt-14 sm:columns-3 lg:columns-4 [&>*]:mb-4">
						{SHOWCASE_ITEMS.map((item, idx) => (
							<div
								key={item.key}
								data-sc-reveal
								className="group relative cursor-pointer overflow-hidden rounded-xl break-inside-avoid ring-1 ring-inset ring-white/[0.08] transition-all duration-500 hover:ring-primary-500/40"
								onClick={() => openLightbox(idx)}
							>
								<img
									src={item.src}
									alt=""
									loading="lazy"
									draggable={false}
									className="w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								/>
								{/* Hover overlay */}
								<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
									<div className="flex size-12 scale-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-100">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
											className="size-5"
										>
											<circle cx="11" cy="11" r="8" />
											<path d="m21 21-4.3-4.3" />
											<path d="M11 8v6" />
											<path d="M8 11h6" />
										</svg>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Gallery stats */}
					<div
						data-sc-reveal
						className="mt-14 flex items-center justify-center gap-8 text-center sm:mt-16"
					>
						<div>
							<p className="text-2xl font-bold text-white sm:text-3xl">500+</p>
							<p className="mt-1 text-xs font-medium uppercase tracking-wide text-white/40">
								{t("showcasePage.statsWorks")}
							</p>
						</div>
						<div className="h-8 w-px bg-white/10" />
						<div>
							<p className="text-2xl font-bold text-white sm:text-3xl">200+</p>
							<p className="mt-1 text-xs font-medium uppercase tracking-wide text-white/40">
								{t("showcasePage.statsCreators")}
							</p>
						</div>
						<div className="h-8 w-px bg-white/10" />
						<div>
							<p className="text-2xl font-bold text-white sm:text-3xl">12</p>
							<p className="mt-1 text-xs font-medium uppercase tracking-wide text-white/40">
								{t("showcasePage.statsCountries")}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Lightbox */}
			<AnimatePresence>
				{lightboxIdx !== null && (
					<Lightbox
						src={SHOWCASE_ITEMS[lightboxIdx].src}
						onClose={closeLightbox}
						onPrev={goPrev}
						onNext={goNext}
					/>
				)}
			</AnimatePresence>

			<SiteFooter />
		</main>
	);
}
