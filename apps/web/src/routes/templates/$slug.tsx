import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PageHeader } from "#/components/layout/page-header";
import { SiteFooter } from "#/components/layout/site-footer";
import { ArrowUpRightIcon } from "#/components/ui/icons";
import { templatesShowcase } from "#/content/site";
import { useTranslation } from "#/i18n/useTranslation";
import { EASE, gsap, useGSAP } from "#/lib/animations";
import { pressable } from "#/lib/animations";
import { cn } from "#/lib/utils/cn";

export const Route = createFileRoute("/templates/$slug")({
  component: TemplateDetailPage,
});

/* ── Sample result images per template (multiple per template) ── */
const TEMPLATE_GALLERY: Record<string, string[]> = {
  "stretch-wave-timur": [
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&h=1100&fit=crop&q=80",
  ],
  "shape-text-mask": [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=900&h=1100&fit=crop&q=80",
  ],
  "text-fill": [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522444195799-478538b28823?w=900&h=1100&fit=crop&q=80",
  ],
  "glitch-poster": [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551893478-d60cc920032e?w=900&h=1100&fit=crop&q=80",
  ],
  "duotone-portrait": [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=1100&fit=crop&q=80",
  ],
  "halftone-magazine": [
    "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=1100&fit=crop&q=80",
  ],
  "vintage-film": [
    "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522444195799-478538b28823?w=900&h=1100&fit=crop&q=80",
  ],
  "neon-glow": [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551893478-d60cc920032e?w=900&h=1100&fit=crop&q=80",
  ],
  "pixel-mosaic": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=1100&fit=crop&q=80",
  ],
  "wave-dreams": [
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=900&h=1100&fit=crop&q=80",
  ],
  "bold-split": [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=1100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&h=1100&fit=crop&q=80",
  ],
};

const TAG_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  Distortion: { bg: "bg-[#ff6a3a]/15", text: "text-[#ff9a6a]", ring: "ring-[#ff6a3a]/30" },
  Typography: { bg: "bg-[#3ae4ff]/15", text: "text-[#6aefff]", ring: "ring-[#3ae4ff]/30" },
  Photoshop: { bg: "bg-[#c23bd6]/15", text: "text-[#d97ce8]", ring: "ring-[#c23bd6]/30" },
  Glitch: { bg: "bg-[#00ffaa]/15", text: "text-[#66ffcc]", ring: "ring-[#00ffaa]/30" },
  Duotone: { bg: "bg-[#e8d5b7]/15", text: "text-[#e8d5b7]", ring: "ring-[#e8d5b7]/30" },
  Print: { bg: "bg-[#ffcc44]/15", text: "text-[#ffdd77]", ring: "ring-[#ffcc44]/30" },
  Film: { bg: "bg-[#d4c4a0]/15", text: "text-[#d4c4a0]", ring: "ring-[#d4c4a0]/30" },
  Neon: { bg: "bg-[#ff00ff]/15", text: "text-[#ff66ff]", ring: "ring-[#ff00ff]/30" },
  Retro: { bg: "bg-[#00ff88]/15", text: "text-[#66ffaa]", ring: "ring-[#00ff88]/30" },
  Surreal: { bg: "bg-[#c8a0ff]/15", text: "text-[#d4b8ff]", ring: "ring-[#c8a0ff]/30" },
  Bold: { bg: "bg-white/15", text: "text-white/85", ring: "ring-white/25" },
  Verzerrung: { bg: "bg-[#ff6a3a]/15", text: "text-[#ff9a6a]", ring: "ring-[#ff6a3a]/30" },
  Tipografi: { bg: "bg-[#3ae4ff]/15", text: "text-[#6aefff]", ring: "ring-[#3ae4ff]/30" },
  Distorsi: { bg: "bg-[#ff6a3a]/15", text: "text-[#ff9a6a]", ring: "ring-[#ff6a3a]/30" },
  Cetak: { bg: "bg-[#ffcc44]/15", text: "text-[#ffdd77]", ring: "ring-[#ffcc44]/30" },
  Tegas: { bg: "bg-white/15", text: "text-white/85", ring: "ring-white/25" },
  Fett: { bg: "bg-white/15", text: "text-white/85", ring: "ring-white/25" },
  Druck: { bg: "bg-[#ffcc44]/15", text: "text-[#ffdd77]", ring: "ring-[#ffcc44]/30" },
  Typografie: { bg: "bg-[#3ae4ff]/15", text: "text-[#6aefff]", ring: "ring-[#3ae4ff]/30" },
};

const DEFAULT_TAG = { bg: "bg-white/10", text: "text-white/70", ring: "ring-white/15" };

/* ── Lightbox ──────────────────────────────────────────── */
function Lightbox({
  images,
  idx,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  idx: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 hover:text-white sm:right-6 sm:top-6" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
      </button>

      <button type="button" onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 sm:left-6 sm:size-12" aria-label="Previous">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="m15 18-6-6 6-6" /></svg>
      </button>

      <button type="button" onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 sm:right-6 sm:size-12" aria-label="Next">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="m9 18 6-6-6-6" /></svg>
      </button>

      <motion.img
        key={images[idx]}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        src={images[idx]}
        alt=""
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] select-none rounded-2xl object-contain shadow-2xl sm:max-w-[75vw]"
      />

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/60 ring-1 ring-white/15 backdrop-blur-sm sm:bottom-6">
        {idx + 1} / {images.length}
      </div>
    </motion.div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
function TemplateDetailPage() {
  const { slug } = useParams({ from: "/templates/$slug" });
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const template = templatesShowcase.find((tpl) => tpl.templateId === slug);
  const gallery = TEMPLATE_GALLERY[slug] ?? [];

  useEffect(() => {
    if (template) {
      const title = t(`templates.${template.key}.title`);
      document.title = `${title} — ZINEFORGE`;
    } else {
      document.title = "Template — ZINEFORGE";
    }
  }, [template, t]);

  useGSAP(
    () => {
      gsap.from("[data-detail-reveal]", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: EASE.expo,
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: sectionRef },
  );

  if (!template) {
    return (
      <main className="relative min-h-svh bg-ink-950">
        <PageHeader />
        <div className="flex min-h-[50vh] items-center justify-center px-5">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Template not found</h1>
            <p className="mt-3 text-white/50">The template you're looking for doesn't exist.</p>
            <Link to="/templates" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
              Browse Templates
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  const tag = t(`templates.${template.key}.tag`);
  const title = t(`templates.${template.key}.title`);
  const description = t(`templates.${template.key}.description`);
  const tagColor = TAG_COLORS[tag] ?? DEFAULT_TAG;

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const goPrev = () => setLightboxIdx((i) => i !== null ? (i - 1 + gallery.length) % gallery.length : null);
  const goNext = () => setLightboxIdx((i) => i !== null ? (i + 1) % gallery.length : null);

  /* Get related templates (same tag, different template) */
  const related = templatesShowcase
    .filter((tpl) => tpl.key !== template.key && tpl.templateId)
    .slice(0, 3);

  return (
    <main className="relative min-h-svh bg-ink-950">
      <PageHeader />

      <div ref={sectionRef} className="relative px-5 pb-20 sm:px-10 lg:px-20">
        {/* Ambient glow */}
        <div aria-hidden className="pointer-events-none absolute -left-40 -top-20 h-[600px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,#ff4d0050_0%,#ff6a1a20_40%,transparent_70%)] opacity-80 blur-[120px]" />

        <div className="relative mx-auto max-w-[1440px]">
          {/* Breadcrumb */}
          <nav data-detail-reveal className="mb-8 flex items-center gap-2 text-sm text-white/40">
            <Link to="/templates" className="transition hover:text-white/70">{t("templatesPage.badge")}</Link>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="m9 18 6-6-6-6" /></svg>
            <span className="text-white/60">{title}</span>
          </nav>

          {/* Main layout: image gallery + info */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:gap-14 xl:grid-cols-[1fr_440px]">
            {/* Left: Gallery */}
            <div data-detail-reveal>
              {/* Main image */}
              <div
                className="group relative cursor-pointer overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10 transition-all duration-300 hover:ring-primary-500/40"
                onClick={() => openLightbox(selectedImg)}
              >
                <div className={cn("absolute inset-0 bg-linear-to-br opacity-30", template.accent)} />
                <img
                  src={gallery[selectedImg] ?? gallery[0]}
                  alt={title}
                  draggable={false}
                  className="relative z-[1] aspect-[3/4] w-full select-none object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                {/* Zoom hint */}
                <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
                  <div className="flex size-14 scale-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" /></svg>
                  </div>
                </div>
              </div>

              {/* Thumbnail strip */}
              {gallery.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {gallery.map((src, idx) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setSelectedImg(idx)}
                      className={cn(
                        "relative shrink-0 overflow-hidden rounded-xl transition-all duration-200",
                        selectedImg === idx
                          ? "ring-2 ring-primary-500 ring-offset-2 ring-offset-ink-950"
                          : "opacity-60 ring-1 ring-white/10 hover:opacity-90",
                      )}
                    >
                      <img src={src} alt="" className="size-20 object-cover sm:size-24" draggable={false} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info panel */}
            <div data-detail-reveal className="flex flex-col">
              <span className={cn("inline-flex w-fit items-center rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset backdrop-blur-sm", tagColor.bg, tagColor.text, tagColor.ring)}>
                {tag}
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-0.01em] text-white sm:text-4xl">
                {title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-white/55">
                {description}
              </p>

              {/* Features list */}
              <div className="mt-8 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                  {t("templateDetailPage.features")}
                </h3>
                <div className="space-y-3">
                  {[
                    t("templateDetailPage.feature1"),
                    t("templateDetailPage.feature2"),
                    t("templateDetailPage.feature3"),
                    t("templateDetailPage.feature4"),
                  ].map((feat) => (
                    <div key={feat} className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-500/15">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-3 text-primary-400"><path d="M20 6 9 17l-5-5" /></svg>
                      </div>
                      <span className="text-sm text-white/70">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery count */}
              <div className="mt-8 flex items-center gap-4 rounded-xl bg-white/[0.04] px-5 py-4 ring-1 ring-inset ring-white/8">
                <div>
                  <p className="text-xl font-bold text-white">{gallery.length}</p>
                  <p className="text-xs font-medium text-white/40">{t("templateDetailPage.exampleResults")}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <p className="text-xl font-bold text-primary-400">HD</p>
                  <p className="text-xs font-medium text-white/40">{t("templateDetailPage.exportQuality")}</p>
                </div>
              </div>

              {/* CTA */}
              <motion.div className="mt-8" {...pressable}>
                <Link
                  to="/editor"
                  search={{ template: slug }}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#f97505] via-[#e85a10] to-[#d83a10] px-8 py-4 text-base font-bold text-white shadow-[0_8px_30px_-6px_rgba(238,61,11,0.5)] transition-all duration-300 hover:shadow-[0_12px_40px_-6px_rgba(238,61,11,0.6)]"
                >
                  {t("templateDetailPage.useTemplate")}
                  <ArrowUpRightIcon className="size-4" />
                </Link>
              </motion.div>

              {/* Back link */}
              <Link
                to="/templates"
                className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-white/40 transition hover:text-white/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="m15 18-6-6 6-6" /></svg>
                {t("templateDetailPage.backToTemplates")}
              </Link>
            </div>
          </div>

          {/* Related templates */}
          {related.length > 0 && (
            <div className="mt-20 sm:mt-24">
              <h2 data-detail-reveal className="text-xl font-bold text-white sm:text-2xl">
                {t("templateDetailPage.relatedTitle")}
              </h2>
              <div data-detail-reveal className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rel) => {
                  const rTag = t(`templates.${rel.key}.tag`);
                  const rTitle = t(`templates.${rel.key}.title`);
                  const rDesc = t(`templates.${rel.key}.description`);
                  const rColor = TAG_COLORS[rTag] ?? DEFAULT_TAG;
                  return (
                    <Link
                      key={rel.key}
                      to="/templates/$slug"
                      params={{ slug: rel.templateId! }}
                      className="group relative isolate flex h-[320px] flex-col overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-inset ring-white/10 transition-all duration-300 hover:ring-primary-500/50 hover:shadow-[0_8px_30px_-12px_rgba(238,61,11,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                    >
                      <div aria-hidden className={cn("absolute inset-0 bg-linear-to-br opacity-80 transition-transform duration-700 group-hover:scale-110", rel.accent)} />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.05)_0%,rgba(8,8,10,0.3)_40%,rgba(8,8,10,0.9)_100%)]" />
                      <div className="grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />
                      <div className="flex-1" />
                      <div className="relative z-10 p-5">
                        <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset backdrop-blur-sm", rColor.bg, rColor.text, rColor.ring)}>{rTag}</span>
                        <h3 className="mt-3 text-base font-bold text-white">{rTitle}</h3>
                        <p className="mt-1.5 line-clamp-2 text-[13px] text-white/50">{rDesc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && gallery.length > 0 && (
          <Lightbox
            images={gallery}
            idx={lightboxIdx}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>

      <SiteFooter />
    </main>
  );
}
