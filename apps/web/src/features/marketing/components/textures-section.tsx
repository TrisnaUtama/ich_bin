import { useRef } from "react";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

const TEXTURES = [
	{ image: "/textures/Texture_Midnight_Crease.png" },
	{ image: "/textures/Texture_Noise_Gradient_Mesh.png" },
	{ image: "/textures/TEXTURE_Derforated_Mesh.png" },
	{ image: "/textures/Texture_Dark_Waters_Pulse.png" },
] as const;

/** Staggered vertical offset: odd cards shift down */
const CARD_OFFSET = [
	"lg:translate-y-0",
	"lg:translate-y-12",
	"lg:translate-y-0",
	"lg:translate-y-12",
];

export function TexturesSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const { dict } = useTranslation();

	const section = (dict as Record<string, unknown>).texturesSection as
		| {
				badge: string;
				heading: string;
				subheading: string;
				textures: { title: string; description: string }[];
		  }
		| undefined;

	useGSAP(
		() => {
			gsap.from("[data-texture-reveal]", {
				y: 32,
				opacity: 0,
				duration: 0.9,
				ease: EASE.expo,
				stagger: 0.12,
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 75%",
				},
			});
		},
		{ scope: sectionRef },
	);

	if (!section) return null;

	return (
		<section
			ref={sectionRef}
			className="relative overflow-hidden bg-ink-950 px-6 py-24 sm:px-10 sm:py-28 lg:px-20 lg:pb-36"
		>
			<div className="relative mx-auto max-w-[1320px]">
				{/* ── Header ── */}
				<div data-texture-reveal className="mx-auto max-w-2xl text-center">
					<span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
						<span className="text-white/40">✦</span>
						{section.badge}
					</span>
					<h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
						{section.heading}
					</h2>
					<p className="mt-4 text-base leading-relaxed text-white/40 sm:text-lg">
						{section.subheading}
					</p>
				</div>

				{/* ── 4 Texture Cards with staggered vertical positions ── */}
				<div
					data-texture-reveal
					className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:flex lg:justify-center"
				>
					{TEXTURES.map((texture, i) => {
						const data = section.textures[i];
						if (!data) return null;
						const num = String(i + 1).padStart(2, "0");

						return (
							<div
								key={texture.image}
								className={cn(
									"group relative w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-white/[0.07] transition-all duration-300 hover:ring-white/15",
									CARD_OFFSET[i], "h-[480px] sm:max-w-[320px] lg:w-[280px] lg:shrink-0",
								)}
							>
								{/* Number label */}
								<div className="absolute left-5 top-5 z-10 flex items-center gap-1.5">
									<span className="text-[11px] text-white/30">✦</span>
									<span className="text-sm font-medium tracking-wide text-white/50">
										{num}
									</span>
								</div>

								{/* Full-bleed texture image */}
								<div className="absolute inset-0 overflow-hidden">
									<img
										src={texture.image}
										alt={data.title}
										loading="lazy"
										draggable={false}
										className="h-full w-full select-none object-cover object-center transition-transform duration-500 group-hover:scale-105"
									/>
									{/* Bottom gradient for text readability */}
									<div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
								</div>

								{/* Title + description overlaid on bottom of image */}
								<div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-5">
									<h3 className="text-base font-semibold leading-snug text-white sm:text-lg">
										{data.title}
									</h3>
									<p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
										{data.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
