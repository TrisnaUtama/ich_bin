import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter } from "#/components/layout/site-footer";
import { SiteHeader } from "#/components/layout/site-header";
import { HeroSection, ShowcaseSection, TemplatesSection, TexturesSection, WhyUsSection } from "#/features/marketing";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
	useEffect(() => { document.title = "ZINEFORGE — Create Studio-Grade Posters & Merch"; }, []);

	return (
		<main className="relative min-h-svh bg-ink-950">
			<SiteHeader />
			<HeroSection />
			<TemplatesSection />
			<WhyUsSection />
			<ShowcaseSection />
			<TexturesSection />
			<SiteFooter />
		</main>
	);
}
