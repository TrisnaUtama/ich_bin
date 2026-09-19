import { motion } from "motion/react";
import { GoogleIcon } from "#/components/ui/icons";
import { softSpring } from "#/lib/animations";

type GoogleButtonProps = {
	onClick?: () => void;
};

export function GoogleButton({ onClick }: GoogleButtonProps) {
	return (
		<motion.button
			type="button"
			onClick={onClick}
			whileHover={{ y: -2, scale: 1.01 }}
			whileTap={{ scale: 0.985 }}
			transition={softSpring}
			className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-6 py-4 text-base font-semibold text-ink-950 shadow-[0_20px_44px_-24px_rgba(255,255,255,0.45)] sm:py-4.5"
		>
			<span className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,158,60,0.35),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
			<GoogleIcon className="relative size-5" />
			<span className="relative">Continue with Google</span>
		</motion.button>
	);
}
