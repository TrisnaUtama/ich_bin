import type { Transition, Variants } from "motion/react";

export const softSpring: Transition = {
	type: "spring",
	stiffness: 220,
	damping: 28,
	mass: 0.9,
};

export const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
	},
};

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

export const staggerParent: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

export const scaleReveal: Variants = {
	hidden: { opacity: 0, scale: 1.06 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
	},
};

export const pressable = {
	whileHover: { y: -2, scale: 1.015 },
	whileTap: { scale: 0.98 },
	transition: softSpring,
} as const;
