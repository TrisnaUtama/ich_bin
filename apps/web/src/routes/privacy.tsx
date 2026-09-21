import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageHeader } from "#/components/layout/page-header";
import { SiteFooter } from "#/components/layout/site-footer";
import { useTranslation } from "#/i18n/useTranslation";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
	const { t, dict } = useTranslation();

	const page = (dict as Record<string, unknown>).privacyPage as
		| {
				title: string;
				lastUpdated: string;
				sections: { heading: string; body: string }[];
		  }
		| undefined;

	useEffect(() => {
		document.title = `${page?.title ?? "Privacy Policy"} — ZINEFORGE`;
	}, [page?.title]);

	if (!page) return null;

	return (
		<main className="relative min-h-svh bg-ink-950">
			<PageHeader />

			<article className="px-6 pb-24 sm:px-10 lg:px-20">
				<div className="mx-auto max-w-3xl">
					<h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
						{page.title}
					</h1>
					<p className="mt-3 text-sm text-white/40">{page.lastUpdated}</p>

					<div className="mt-12 space-y-10 text-[15px] leading-relaxed text-white/60">
						{page.sections.map((section, i) => (
							<section key={i}>
								<h2 className="mb-4 text-lg font-semibold text-white">
									{i + 1}. {section.heading}
								</h2>
								<p>{section.body}</p>
							</section>
						))}
					</div>
				</div>
			</article>

			<SiteFooter />
		</main>
	);
}
