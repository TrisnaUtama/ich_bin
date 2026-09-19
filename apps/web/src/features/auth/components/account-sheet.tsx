import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRightIcon, CloseIcon } from "#/components/ui/icons";
import { useTranslation } from "#/i18n/useTranslation";
import { cn } from "#/lib/utils/cn";
import { useAuthStore } from "#/stores/auth-store";
import { useLogout } from "../hooks/use-logout";

type TabKey = "overview" | "billing" | "templates" | "subscription";

function initials(name: string | null, email: string) {
	const source = name?.trim() || email;
	const parts = source.split(/[\s@.]+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
	return (parts[0]![0] + parts[1]![0]).toUpperCase();
}

export function AccountSheet({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const { t } = useTranslation();
	const user = useAuthStore((s) => s.user);
	const { logout, isLoading } = useLogout();
	const [tab, setTab] = useState<TabKey>("overview");

	const tabs: { key: TabKey; label: string }[] = [
		{ key: "overview", label: t("account.overview") },
		{ key: "billing", label: t("account.billing") },
		{ key: "templates", label: t("account.templates") },
		{ key: "subscription", label: t("account.subscription") },
	];

	if (!user) return null;

	// Rendered through a portal so this fixed-position overlay always covers
	// the whole viewport, regardless of whether some ancestor (a GSAP-animated
	// nav item, a `backdrop-blur` toolbar, etc.) happens to create its own
	// CSS containing block — which would otherwise trap `position: fixed`
	// children inside that ancestor's box instead of the real viewport.
	return createPortal(
		<AnimatePresence>
			{open ? (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={onClose}
						className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
					/>
					<motion.aside
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "spring", stiffness: 320, damping: 34 }}
						className="fixed inset-y-0 right-0 z-101 flex w-full max-w-md flex-col bg-ink-950 shadow-[0_0_80px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-white/10 sm:max-w-sm"
					>
						{/* Header */}
						<div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
							<h2 className="text-base font-semibold text-white">
								{t("account.menuTitle")}
							</h2>
							<button
								type="button"
								onClick={onClose}
								aria-label={t("account.close")}
								className="inline-flex size-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
							>
								<CloseIcon className="size-4" />
							</button>
						</div>

						{/* Profile summary */}
						<div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
							{user.avatarUrl ? (
								<img
									src={user.avatarUrl}
									alt={user.name ?? user.email}
									className="size-12 shrink-0 rounded-full object-cover ring-2 ring-primary-500/50"
								/>
							) : (
								<div className="primary-gradient flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 ring-primary-500/50">
									{initials(user.name, user.email)}
								</div>
							)}
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-white">
									{user.name ?? user.email}
								</p>
								<p className="truncate text-xs text-white/50">{user.email}</p>
							</div>
						</div>

						{/* Tabs */}
						<div className="flex gap-1 overflow-x-auto border-b border-white/10 px-3 py-2">
							{tabs.map((tabItem) => (
								<button
									key={tabItem.key}
									type="button"
									onClick={() => setTab(tabItem.key)}
									className={cn(
										"shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
										tab === tabItem.key
											? "bg-primary-500 text-white"
											: "text-white/55 hover:bg-white/10 hover:text-white",
									)}
								>
									{tabItem.label}
								</button>
							))}
						</div>

						{/* Content */}
						<div className="flex-1 overflow-y-auto px-5 py-5">
							{tab === "overview" && (
								<div className="space-y-4">
									<div className="rounded-2xl border border-white/10 bg-ink-900/70 p-4">
										<p className="text-xs font-medium uppercase tracking-wide text-white/45">
											{t("account.creditBalance")}
										</p>
										<div className="mt-2 flex items-end justify-between">
											<p className="text-3xl font-bold text-white">
												{user.creditBalance}
												<span className="ml-1.5 text-sm font-medium text-white/50">
													{t("account.credits")}
												</span>
											</p>
											<button
												type="button"
												className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
											>
												{t("account.buyCredits")}
											</button>
										</div>
									</div>

									<div className="rounded-2xl border border-white/10 bg-ink-900/70 p-4">
										<p className="text-xs font-medium uppercase tracking-wide text-white/45">
											{t("account.currentPlan")}
										</p>
										<div className="mt-2 flex items-center justify-between">
											<p className="text-sm font-semibold text-white">
												{t("account.freePlan")}
											</p>
											<button
												type="button"
												onClick={() => setTab("subscription")}
												className="primary-gradient inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white"
											>
												{t("account.upgrade")}
											</button>
										</div>
									</div>
								</div>
							)}

							{tab === "billing" && (
								<div className="space-y-4">
									<div className="rounded-2xl border border-white/10 bg-ink-900/70 p-4">
										<p className="text-xs font-medium uppercase tracking-wide text-white/45">
											{t("account.paymentMethod")}
										</p>
										<p className="mt-2 text-sm text-white/60">
											{t("account.noPaymentMethod")}
										</p>
										<button
											type="button"
											className="mt-3 w-full rounded-xl border border-dashed border-white/15 py-2.5 text-xs font-medium text-white/60 transition-colors hover:border-primary-500 hover:text-white"
										>
											{t("account.addPaymentMethod")}
										</button>
									</div>

									<div className="rounded-2xl border border-white/10 bg-ink-900/70 p-4">
										<p className="text-xs font-medium uppercase tracking-wide text-white/45">
											{t("account.billingHistory")}
										</p>
										<p className="mt-2 text-sm text-white/60">
											{t("account.noBillingHistory")}
										</p>
									</div>
								</div>
							)}

							{tab === "templates" && (
								<div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 px-5 py-10 text-center">
									<p className="text-sm font-medium text-white">
										{t("account.purchasedTemplatesTitle")}
									</p>
									<p className="mt-1.5 max-w-xs text-xs text-white/50">
										{t("account.purchasedTemplatesEmpty")}
									</p>
									<button
										type="button"
										onClick={() => {
											onClose();
											window.location.hash = "templates";
										}}
										className="..."
									>
										{t("account.browseTemplates")}
										<ArrowUpRightIcon className="size-3.5" />
									</button>
								</div>
							)}

							{tab === "subscription" && (
								<div className="space-y-4">
									<div className="rounded-2xl border border-white/10 bg-ink-900/70 p-4">
										<div className="flex items-center justify-between">
											<p className="text-xs font-medium uppercase tracking-wide text-white/45">
												{t("account.subscriptionStatus")}
											</p>
											<span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
												{t("account.freePlan")}
											</span>
										</div>
										<p className="mt-2 text-sm text-white/60">
											{t("account.subscriptionNone")}
										</p>
										<button
											type="button"
											className="primary-gradient mt-3 w-full rounded-xl py-2.5 text-sm font-semibold text-white"
										>
											{t("account.viewPlans")}
										</button>
									</div>
								</div>
							)}
						</div>

						{/* Footer */}
						<div className="border-t border-white/10 p-4">
							<button
								type="button"
								onClick={() => logout()}
								disabled={isLoading}
								className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
							>
								{isLoading ? t("account.loggingOut") : t("account.logout")}
							</button>
						</div>
					</motion.aside>
				</>
			) : null}
		</AnimatePresence>,
		document.body,
	);
}
