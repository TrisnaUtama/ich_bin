import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { BrandMark } from "#/components/ui/brand-mark";
import { CloseIcon, MenuIcon } from "#/components/ui/icons";
import { navLinks } from "#/content/site";
import { EASE, gsap, pressable, softSpring, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

export function SiteHeader() {
	const [open, setOpen] = useState(false);
	const headerRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			gsap.from("[data-header-item]", {
				y: -24,
				opacity: 0,
				duration: 0.9,
				ease: EASE.expo,
				stagger: 0.08,
				delay: 0.15,
			});
		},
		{ scope: headerRef },
	);

	return (
		<header
			ref={headerRef}
			className="absolute inset-x-0 top-0 z-50 px-5 py-5 sm:px-8 lg:px-12"
		>
			<nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-6">
				<Link to="/" data-header-item className="shrink-0">
					<BrandMark className="text-lg sm:text-xl" />
				</Link>

				<ul
					data-header-item
					className="hidden items-center gap-1 lg:flex"
					aria-label="Primary"
				>
					{navLinks.map((link, index) => (
						<li key={link.label}>
							<a
								href={link.href}
								className={cn(
									"relative inline-flex items-center rounded-full px-6 py-2.5 text-[15px] font-medium text-white/85 transition-colors duration-300 hover:text-white",
									index === 0 &&
										"text-white ring-1 ring-inset ring-white/70 hover:bg-white/10",
								)}
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>

				<div data-header-item className="flex items-center gap-3">
					<motion.div {...pressable} className="hidden sm:block">
						<Link
							to="/login"
							className="inline-flex items-center rounded-full bg-white px-7 py-3 text-[15px] font-semibold text-flare-500 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:bg-ember-100"
						>
							Login / Sign Up
						</Link>
					</motion.div>

					<button
						type="button"
						onClick={() => setOpen((value) => !value)}
						aria-label={open ? "Close menu" : "Open menu"}
						aria-expanded={open}
						className="inline-flex size-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/30 backdrop-blur-md transition-colors hover:bg-white/25 lg:hidden"
					>
						{open ? (
							<CloseIcon className="size-5" />
						) : (
							<MenuIcon className="size-5" />
						)}
					</button>
				</div>
			</nav>

			<AnimatePresence>
				{open ? (
					<motion.div
						initial={{ opacity: 0, y: -12, height: 0 }}
						animate={{ opacity: 1, y: 0, height: "auto" }}
						exit={{ opacity: 0, y: -12, height: 0 }}
						transition={softSpring}
						className="mt-4 overflow-hidden rounded-3xl bg-ink-950/70 p-3 ring-1 ring-inset ring-white/15 backdrop-blur-xl lg:hidden"
					>
						<ul className="flex flex-col">
							{navLinks.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										onClick={() => setOpen(false)}
										className="block rounded-2xl px-5 py-3.5 text-base font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
									>
										{link.label}
									</a>
								</li>
							))}
							<li className="p-2 sm:hidden">
								<Link
									to="/login"
									onClick={() => setOpen(false)}
									className="block rounded-full bg-white px-6 py-3 text-center text-[15px] font-semibold text-flare-500"
								>
									Login / Sign Up
								</Link>
							</li>
						</ul>
					</motion.div>
				) : null}
			</AnimatePresence>
		</header>
	);
}
