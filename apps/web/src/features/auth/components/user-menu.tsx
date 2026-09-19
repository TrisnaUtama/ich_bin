import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "#/i18n/useTranslation";
import { useAuthStore } from "#/stores/auth-store";
import { useLogout } from "../hooks/use-logout";
import { AccountSheet } from "./account-sheet";

function initials(name: string | null, email: string) {
	const source = name?.trim() || email;
	const parts = source.split(/[\s@.]+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
	return (parts[0]![0] + parts[1]![0]).toUpperCase();
}

export function UserMenu({ className }: { className?: string }) {
	const { t } = useTranslation();
	const user = useAuthStore((s) => s.user);
	const { logout, isLoading } = useLogout();
	const [open, setOpen] = useState(false);
	const [sheetOpen, setSheetOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onClick = (e: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(e.target as Node))
				setOpen(false);
		};
		document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, [open]);

	if (!user) return null;

	const avatar = user.avatarUrl ? (
		<img
			src={user.avatarUrl}
			alt={user.name ?? user.email}
			className="size-9 shrink-0 rounded-full object-cover ring-2 ring-white/15"
		/>
	) : (
		<div className="primary-gradient flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white/15">
			{initials(user.name, user.email)}
		</div>
	);

	return (
		<div ref={rootRef} className={className}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-haspopup="menu"
				aria-expanded={open}
				className="flex items-center gap-2 rounded-full p-0.5 pr-1 transition-colors hover:bg-white/10"
			>
				{avatar}
			</button>

			<div className="relative">
				<AnimatePresence>
					{open ? (
						<motion.div
							initial={{ opacity: 0, y: -8, scale: 0.96 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -8, scale: 0.96 }}
							transition={{ duration: 0.15, ease: "easeOut" }}
							className="absolute right-0 top-2 z-50 w-64 overflow-hidden rounded-2xl bg-ink-900/95 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] ring-1 ring-inset ring-white/15 backdrop-blur-xl"
						>
							<div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
								{avatar}
								<div className="min-w-0">
									<p className="truncate text-sm font-semibold text-white">
										{user.name ?? user.email}
									</p>
									<p className="truncate text-xs text-white/50">{user.email}</p>
								</div>
							</div>

							<div className="flex items-center justify-between px-4 py-3 text-sm">
								<span className="text-white/55">
									{t("account.creditBalance")}
								</span>
								<span className="font-semibold text-white">
									{user.creditBalance}{" "}
									<span className="text-white/45">{t("account.credits")}</span>
								</span>
							</div>

							<div className="border-t border-white/10 p-1.5">
								<button
									type="button"
									onClick={() => {
										setOpen(false);
										setSheetOpen(true);
									}}
									className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
								>
									{t("account.menuTitle")}
								</button>
								<button
									type="button"
									onClick={() => logout()}
									disabled={isLoading}
									className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/70 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
								>
									{isLoading ? t("account.loggingOut") : t("account.logout")}
								</button>
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>

			<AccountSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
		</div>
	);
}
