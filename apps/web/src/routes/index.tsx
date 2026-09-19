import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "#/components/layout/site-header";
import { HeroSection } from "#/features/marketing";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
  return (
    <main className="relative min-h-svh bg-ink-950">
      <SiteHeader />
      <HeroSection />
    </main>
  );
}
