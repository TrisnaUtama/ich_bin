import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "#/components/ui/brand-mark";
import { CloseIcon, MenuIcon } from "#/components/ui/icons";
import { LanguageSwitcher } from "#/components/ui/language-switcher";
import { navLinks } from "#/content/site";
import { UserMenu } from "#/features/auth";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, pressable, softSpring, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";
import { useAuthStore } from "#/stores/auth-store";

export function SiteHeader() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [activeHash, setActiveHash] = useState("");
	const headerRef = useRef<HTMLElement>(null);
	const { t } = useTranslation();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const navLabel = (key: (typeof navLinks)[number]["key"]) => t(`nav.${key}`);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 32);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

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

	const isActive = (href: string) => {
		if (href === "/") return activeHash === "" || activeHash === "#";
		if (href.startsWith("#")) return activeHash === href;
		return false;
	};

	return (
		<header
			ref={headerRef}
			className={cn(
				"fixed inset-x-0 top-0 z-50 px-5 py-5 transition-colors duration-300 sm:px-8 lg:px-12",
				scrolled
					? "bg-ink-950/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
					: "bg-transparent",
			)}
		>
			<nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-6">
				<Link
					to="/"
					data-header-item
					className="shrink-0"
					onClick={() => setActiveHash("")}
				>
					<BrandMark className="text-lg sm:text-xl" />
				</Link>

				<ul
					data-header-item
					className="hidden items-center gap-1 lg:flex"
					aria-label="Primary"
				>
					{navLinks.map((link) => (
						<li key={link.key}>
							<a
								href={link.href}
								onClick={() => {
									if (link.href.startsWith("#")) setActiveHash(link.href);
									else setActiveHash("");
								}}
								className={cn(
									"relative inline-flex items-center rounded-full px-6 py-2.5 text-[15px] font-medium text-white/85 transition-colors duration-300 hover:text-white",
									isActive(link.href) &&
										"text-white ring-1 ring-inset ring-white/70 hover:bg-white/10",
								)}
							>
								{navLabel(link.key)}
							</a>
						</li>
					))}
				</ul>

				<div data-header-item className="flex items-center gap-3">
					<LanguageSwitcher className="hidden sm:block" />

					{isAuthenticated ? (
						<UserMenu className="hidden sm:block" />
					) : (
						<motion.div {...pressable} className="hidden sm:block">
							<Link
								to="/login"
								className="inline-flex items-center rounded-full bg-white px-7 py-3 text-[15px] font-semibold text-primary-500 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:bg-ember-100"
							>
								{t("nav.login")}
							</Link>
						</motion.div>
					)}

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
						className="mt-4 overflow-hidden rounded-3xl bg-ink-950/90 p-3 ring-1 ring-inset ring-white/15 backdrop-blur-xl lg:hidden"
					>
						<ul className="flex flex-col">
							{navLinks.map((link) => (
								<li key={link.key}>
									<a
										href={link.href}
										onClick={() => {
											setOpen(false);
											setActiveHash(link.href.startsWith("#") ? link.href : "");
										}}
										className={cn(
											"block rounded-2xl px-5 py-3.5 text-base font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white",
											isActive(link.href) && "bg-white/10 text-white",
										)}
									>
										{navLabel(link.key)}
									</a>
								</li>
							))}
							<li className="flex items-center justify-between gap-2 p-2">
								<LanguageSwitcher />
							</li>
							{isAuthenticated ? (
								<li className="flex items-center gap-3 rounded-2xl p-3">
									<UserMenu />
									<span className="text-sm font-medium text-white/70">
										{t("account.menuTitle")}
									</span>
								</li>
							) : (
								<li className="p-2">
									<Link
										to="/login"
										onClick={() => setOpen(false)}
										className="block rounded-full bg-white px-6 py-3 text-center text-[15px] font-semibold text-primary-500"
									>
										{t("nav.login")}
									</Link>
								</li>
							)}
						</ul>
					</motion.div>
				) : null}
			</AnimatePresence>
		</header>
	);
}
