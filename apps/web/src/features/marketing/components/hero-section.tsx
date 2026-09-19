import { ArrowRightCircle } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { hero } from "#/content/site";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, pressable, useGSAP } from "#/lib/animations";
import { HeroBackdrop } from "./hero-backdrop";

export function HeroSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const backdropRef = useRef<HTMLDivElement>(null);
	const { t, tList } = useTranslation();
	const title = tList("hero.title");

	useGSAP(
		() => {
			const timeline = gsap.timeline({ defaults: { ease: EASE.expo } });

			timeline
				.from("[data-hero-word]", {
					yPercent: 118,
					opacity: 0,
					duration: 1.15,
					stagger: 0.045,
				})
				.from(
					"[data-hero-reveal]",
					{ y: 28, opacity: 0, duration: 0.9, stagger: 0.12 },
					"-=0.75",
				);

			gsap.to(backdropRef.current, {
				yPercent: 14,
				scale: 1.08,
				ease: "none",
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top top",
					end: "bottom top",
					scrub: true,
				},
			});
		},
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden"
		>
			<div
				ref={backdropRef}
				className="absolute inset-0 -z-10 will-change-transform"
			>
				<HeroBackdrop src={hero.image} />
			</div>

			<div className="mx-auto w-full max-w-[1600px] px-6 pt-24 sm:px-10 lg:px-23">
				<h1 className="max-w-[16ch] text-[2.6rem] font-bold leading-[1.04] tracking-[-0.03em] bg-[linear-gradient(120deg,#FFFFFF_0%,#F0F066_100%)] bg-clip-text text-transparent drop-shadow-[0_6px_28px_rgba(90,28,2,0.35)] sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
					{title.map((line) => (
						<span key={line} className="block overflow-hidden pb-[0.08em]">
							{line.split(" ").map((word, index) => (
								<span
									key={`${line}-${word}-${index}`}
									data-hero-word
									className="inline-block whitespace-pre will-change-transform"
								>
									{word}
									{index < line.split(" ").length - 1 ? " " : ""}
								</span>
							))}
						</span>
					))}
				</h1>

				<p
					data-hero-reveal
					className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-8 sm:text-lg lg:text-xl"
				>
					{t("hero.description")}
				</p>

				<div
					data-hero-reveal
					className="mt-9 flex flex-col gap-3.5 sm:mt-11 sm:flex-row sm:items-center sm:gap-5"
				>
					<motion.a
						{...pressable}
						href={hero.actions.primary.href}
						className="primary-gradient inline-flex items-center justify-center rounded-2xl px-9 py-4 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-white/10 sm:text-[17px]"
					>
						{t("hero.primaryCta")}
					</motion.a>

					<motion.a
						{...pressable}
						href={hero.actions.secondary.href}
						className="inline-flex items-center justify-center gap-2 rounded-2xl px-9 py-4 text-base font-semibold text-white ring-1 ring-inset ring-white/70 backdrop-blur-[2px] transition-colors duration-300 hover:bg-white/15 sm:text-[17px]"
					>
						{t("hero.secondaryCta")}
						<ArrowRightCircle className="size-5" strokeWidth={1.5} />
					</motion.a>
				</div>
			</div>
		</section>
	);
}
