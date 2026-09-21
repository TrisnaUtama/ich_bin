import { Link } from "@tanstack/react-router";
import { BrandMark } from "#/components/ui/brand-mark";
import { brand } from "#/content/site";
import { useTranslation } from "#/i18n/useTranslation";

const FOOTER_LINKS = {
	product: [
		{ key: "templates", href: "#templates" },
		{ key: "showcase", href: "/showcase" },
		{ key: "editor", href: "/editor" },
	],
	company: [
		{ key: "about", href: "/about" },
		{ key: "blog", href: "/blog" },
	],
	legal: [
		{ key: "terms", href: "/terms" },
		{ key: "privacy", href: "/privacy" },
	],
} as const;

export function SiteFooter() {
	const { t } = useTranslation();
	const year = new Date().getFullYear();

	return (
		<footer className="relative bg-ink-950 px-6 pt-20 pb-10 sm:px-10 lg:px-20">
			{/* Top divider */}
			<div className="mx-auto max-w-[1320px]">
				<div className="h-px w-full bg-white/[0.08]" />

				<div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
					{/* ── Brand column ── */}
					<div className="lg:col-span-5">
						<BrandMark className="text-lg" />
						<p className="mt-4 max-w-sm text-sm leading-relaxed text-white/40">
							{t("footer.tagline")}
						</p>
					</div>

					{/* ── Product ── */}
					<div className="lg:col-span-2">
						<h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
							{t("footer.product")}
						</h4>
						<ul className="mt-4 space-y-3">
							{FOOTER_LINKS.product.map((link) => (
								<li key={link.key}>
									<a
										href={link.href}
										className="text-sm text-white/55 transition-colors duration-200 hover:text-white"
									>
										{t(`footer.${link.key}`)}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* ── Company ── */}
					<div className="lg:col-span-2">
						<h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
							{t("footer.company")}
						</h4>
						<ul className="mt-4 space-y-3">
							{FOOTER_LINKS.company.map((link) => (
								<li key={link.key}>
									<Link
										to={link.href}
										className="text-sm text-white/55 transition-colors duration-200 hover:text-white"
									>
										{t(`footer.${link.key}`)}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* ── Legal ── */}
					<div className="lg:col-span-3">
						<h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
							{t("footer.legal")}
						</h4>
						<ul className="mt-4 space-y-3">
							{FOOTER_LINKS.legal.map((link) => (
								<li key={link.key}>
									<Link
										to={link.href}
										className="text-sm text-white/55 transition-colors duration-200 hover:text-white"
									>
										{t(`footer.${link.key}`)}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* ── Bottom bar ── */}
				<div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 sm:flex-row">
					<p className="text-xs text-white/30">
						© {year} {brand.name}. {t("footer.copyright")}
					</p>
					<div className="flex items-center gap-6">
						<Link
							to="/terms"
							className="text-xs text-white/30 transition-colors hover:text-white/60"
						>
							{t("footer.terms")}
						</Link>
						<Link
							to="/privacy"
							className="text-xs text-white/30 transition-colors hover:text-white/60"
						>
							{t("footer.privacy")}
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
