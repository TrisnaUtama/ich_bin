import { motion } from "motion/react";
import { useRef } from "react";
import { auth } from "#/content/site";
import {
	EASE,
	gsap,
	scaleReveal,
	staggerParent,
	useGSAP,
} from "#/lib/animations";
import { cn } from "#/lib/utils/cn";
import { SunsetCanvas } from "./sunset-canvas";
import { TestimonialCard } from "./testimonial-card";

type AuthShowcaseProps = {
	className?: string;
};

export function AuthShowcase({ className }: AuthShowcaseProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			gsap.to("[data-sunset-drift]", {
				yPercent: -6,
				scale: 1.05,
				duration: 14,
				ease: EASE.soft,
				repeat: -1,
				yoyo: true,
			});
		},
		{ scope: containerRef },
	);

	return (
		<motion.div
			ref={containerRef}
			variants={staggerParent}
			initial="hidden"
			animate="visible"
			className={cn(
				"relative flex overflow-hidden rounded-[26px] ring-1 ring-inset ring-white/10",
				className,
			)}
		>
			<motion.div variants={scaleReveal} className="absolute inset-0">
				<div data-sunset-drift className="absolute inset-[-8%]">
					<SunsetCanvas src={auth.image} />
				</div>
			</motion.div>

			<div className="relative mt-auto w-full p-4 sm:p-6">
				<TestimonialCard />
			</div>
		</motion.div>
	);
}
