import { motion } from "motion/react";
import { useRef } from "react";
import { BrandMark } from "#/components/ui/brand-mark";
import { auth } from "#/content/site";
import { EASE, fadeUp, gsap, staggerParent, useGSAP } from "#/lib/animations";
import { useGoogleLogin } from "../hooks/use-google-login";
import { GoogleButton } from "./google-button";

export function LoginPanel() {
	const panelRef = useRef<HTMLDivElement>(null);
	const { login, isLoading, error } = useGoogleLogin();

	useGSAP(
		() => {
			gsap.to("[data-panel-glow]", {
				opacity: 0.55,
				scale: 1.18,
				duration: 6,
				ease: EASE.soft,
				repeat: -1,
				yoyo: true,
			});
		},
		{ scope: panelRef },
	);

	return (
		<div
			ref={panelRef}
			className="relative flex items-center justify-center px-5 py-16 sm:px-10 lg:py-20"
		>
			<div
				data-panel-glow
				aria-hidden
				className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,68,46,0.16),transparent_62%)] opacity-25 blur-3xl"
			/>

			<motion.div
				variants={staggerParent}
				initial="hidden"
				animate="visible"
				className="relative w-full max-w-[27rem] text-center"
			>
				<motion.div variants={fadeUp}>
					<BrandMark withDot className="text-[15px]" />
				</motion.div>

				<motion.h1
					variants={fadeUp}
					className="mt-14 text-[1.75rem] font-bold leading-tight tracking-[-0.025em] text-white sm:mt-16 sm:text-[2.1rem]"
				>
					{auth.heading}
				</motion.h1>

				<motion.p variants={fadeUp} className="mt-3 text-[15px] text-white/60">
					{auth.subheading}
				</motion.p>

				<motion.div variants={fadeUp} className="mt-12">
					<GoogleButton
						onClick={login}
						disabled={isLoading}
						label={isLoading ? "Signing in..." : "Continue with Google"}
					/>
					{error && <p className="mt-3 text-[13px] text-red-400">{error}</p>}
				</motion.div>

				<motion.p variants={fadeUp} className="mt-5 text-[12px] text-white/35">
					By continuing, you agree to our{" "}
					{auth.terms.map((term, index) => (
						<span key={term.label}>
							<a
								href={term.href}
								className="text-white/55 underline-offset-2 transition-colors hover:text-white hover:underline"
							>
								{term.label}
							</a>
							{index < auth.terms.length - 1 ? " and " : ""}
						</span>
					))}
				</motion.p>
			</motion.div>
		</div>
	);
}
