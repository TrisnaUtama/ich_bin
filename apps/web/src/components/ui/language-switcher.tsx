import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, GlobeIcon } from "#/components/ui/icons";
import { LOCALE_LABELS, LOCALES } from "#/i18n";
import { useTranslation } from "#/i18n/useTranslation";
import { cn } from "#/lib/utils/cn";

export function LanguageSwitcher({ className }: { className?: string }) {
	const { locale, setLocale } = useTranslation();
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onClick = (e: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, [open]);

	return (
		<div ref={rootRef} className={cn("relative", className)}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-haspopup="listbox"
				aria-expanded={open}
				className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[15px] font-medium text-white/85 ring-1 ring-inset ring-white/20 backdrop-blur-md transition-colors duration-300 hover:text-white hover:ring-white/40"
			>
				<GlobeIcon className="size-4" />
				{LOCALE_LABELS[locale]}
				<ChevronDownIcon
					className={cn(
						"size-3.5 transition-transform duration-200",
						open && "rotate-180",
					)}
				/>
			</button>

			<AnimatePresence>
				{open ? (
					<motion.ul
						initial={{ opacity: 0, y: -8, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -8, scale: 0.97 }}
						transition={{ duration: 0.16, ease: "easeOut" }}
						role="listbox"
						className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-32 overflow-hidden rounded-2xl bg-ink-900/95 p-1.5 ring-1 ring-inset ring-white/15 backdrop-blur-xl"
					>
						{LOCALES.map((loc) => (
							<li key={loc}>
								<button
									type="button"
									role="option"
									aria-selected={locale === loc}
									onClick={() => {
										setLocale(loc);
										setOpen(false);
									}}
									className={cn(
										"flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
										locale === loc
											? "bg-primary-500/15 text-primary-300"
											: "text-white/75 hover:bg-white/10 hover:text-white",
									)}
								>
									{LOCALE_LABELS[loc]}
								</button>
							</li>
						))}
					</motion.ul>
				) : null}
			</AnimatePresence>
		</div>
	);
}
