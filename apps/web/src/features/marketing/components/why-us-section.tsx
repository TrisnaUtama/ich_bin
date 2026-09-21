import { useRef } from "react";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, useGSAP } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

export function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t, dict } = useTranslation();

  useGSAP(
    () => {
      gsap.from("[data-whyus-reveal]", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: EASE.expo,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef },
  );

  const features = (dict as Record<string, unknown>).whyUsSection as {
    features: { number: string; title: string; description: string }[];
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink-950 px-5 pb-6 sm:px-10 sm:pb-10 lg:px-20 lg:pb-12"
    >
      <div className="relative mx-auto max-w-[1440px]">
        {/* ── Subtle glow: left (purple) ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-[#2C16ED] opacity-20 blur-[120px]"
        />
        {/* ── Subtle glow: right (orange) ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-[#FF870F] opacity-20 blur-[120px]"
        />

        <div
          data-whyus-reveal
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
        >
          <div className="flex flex-col lg:flex-row">
            {/* ── Left panel: artwork image ── */}
            <div className="relative aspect-[4/5] w-full shrink-0 bg-[#f0ece4] sm:aspect-[3/4] lg:aspect-auto lg:w-[44%]">
              <img
                src="/common/why_us.png"
                alt="Zineforge artwork example"
                loading="lazy"
                draggable={false}
                className="h-full w-full select-none object-cover object-center"
              />
            </div>

            {/* ── Right panel: gradient + content ── */}
            <div
              className={cn(
                "relative flex flex-1 flex-col justify-center",
                "bg-gradient-to-br from-[#FD120A] to-[#E16B01]",
                "px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20",
              )}
            >
              {/* Subtle grain overlay */}
              <div className="grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" />

              <div className="relative z-10">
                {/* Badge */}
                <span
                  data-whyus-reveal
                  className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm"
                >
                  {t("whyUsSection.badge")}
                </span>

                {/* Heading */}
                <h2
                  data-whyus-reveal
                  className="mt-6 text-3xl font-extrabold uppercase leading-[1.05] tracking-[-0.01em] text-white sm:text-4xl lg:text-[2.75rem] xl:text-5xl"
                >
                  {t("whyUsSection.heading")}
                </h2>

                {/* Feature grid: 2×2 */}
                <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10">
                  {features.features.map((feature) => (
                    <div key={feature.number} data-whyus-reveal>
                      <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-white">
                        {feature.number}. {feature.title}
                      </p>
                      <p className="mt-2.5 text-sm leading-relaxed text-white/75">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
