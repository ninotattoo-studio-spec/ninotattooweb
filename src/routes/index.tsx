import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FrameCanvas } from "@/components/nino/FrameCanvas";
import { TopNav } from "@/components/nino/TopNav";
import { MediaGrid } from "@/components/nino/MediaGrid";
import { ContactCard } from "@/components/nino/ContactCard";
import { BookingForm } from "@/components/nino/BookingForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Niño Tattoo" },
      { name: "description", content: "Estudio premium de tatuajes, depilación láser, cuidados y piercings." },
    ],
  }),
  component: Index,
});

// Heights in viewport units controlling the cinematic intro
const PHASE1_VH = 120; // chica sequence
const PHASE2_VH = 200; // logo sequence

function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [phase1Progress, setPhase1Progress] = useState(0);
  const [phase2Progress, setPhase2Progress] = useState(0);
  const [logoStarted, setLogoStarted] = useState(false);
  const [bioVisible, setBioVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight;
        const y = window.scrollY;
        const p1Total = (PHASE1_VH / 100) * vh;
        const p2Total = (PHASE2_VH / 100) * vh;

        const p1 = Math.min(1, Math.max(0, y / p1Total));
        const p2 = Math.min(1, Math.max(0, (y - p1Total) / p2Total));

        setPhase1Progress(p1);
        setPhase2Progress(p2);
        setLogoStarted(p1 >= 0.98);
        setBioVisible(p2 >= 0.55);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-onyx text-ivory min-h-screen">
      <TopNav visible={logoStarted} onReserve={scrollToForm} />

      {/* Fixed canvases — chica cross-fades into logo with no jump */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Luxury gold lateral lighting (always on, behind everything) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(45% 70% at 0% 50%, color-mix(in oklab, var(--color-gold) 32%, transparent), transparent 75%), radial-gradient(45% 70% at 100% 50%, color-mix(in oklab, var(--color-gold) 28%, transparent), transparent 75%)",
          }}
        />
        {/* Chica — fades out as phase1 ends */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: phase1Progress >= 1 ? 0 : 1 }}
        >
          <FrameCanvas
            prefix="/frames/chica/hero-girlrt_"
            pad={4}
            start={1}
            end={120}
            ext=".jpg"
            progress={phase1Progress}
            className="absolute inset-0 w-full h-full"
          />
        </div>
        {/* Logo — appears immediately behind chica, fills viewport height on mobile */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{ opacity: phase1Progress >= 1 ? 1 : 0 }}
        >
          <FrameCanvas
            prefix="/frames/logo/logo_ntt_"
            pad={4}
            start={1}
            end={150}
            ext=".jpg"
            progress={phase2Progress}
            freezeAtEnd
            fit="contain"
            className="w-full h-full"
          />
        </div>

        {/* darkening vignette to keep text legible */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(120% 80% at 50% 60%, transparent 30%, rgba(26,26,26,0.55) 80%, rgba(26,26,26,0.85) 100%)",
        }} />
      </div>

      {/* Phase 1 indicator */}
      <div
        className={`fixed left-3 top-1/2 -translate-y-1/2 z-30 transition-opacity duration-700 ${
          phase1Progress > 0.02 && phase1Progress < 0.9 ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <span
          className="block text-[10px] tracking-[0.4em] text-ivory/60 uppercase"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Scroll to experience
        </span>
      </div>

      {/* Spacer for phase 1 + 2 (the fixed canvases sit behind) */}
      <div ref={heroRef} style={{ height: `${PHASE1_VH + PHASE2_VH}vh` }} />

      {/* Content rises over the frozen logo background */}
      <main className="relative z-10 mx-auto w-full max-w-2xl pt-2">
        {/* Bio card */}
        <section
          className={`px-4 sm:px-8 transition-all duration-1000 ${
            bioVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        >
          <article className="relative border border-gold/40 bg-onyx/85 backdrop-blur-md p-7 sm:p-10">
            <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold" />

            <p className="text-[10px] tracking-[0.4em] text-ivory/80 uppercase text-center">Bienvenido</p>
            <h1 className="mt-3 font-display text-3xl sm:text-5xl tracking-[0.1em] text-center text-ivory leading-tight">
              NIÑO TATTOO
            </h1>
            <div className="mx-auto h-px w-16 gold-line my-6" />

            {bioVisible && (
              <p className="word-in font-sans text-ivory/85 leading-relaxed text-[15px] sm:text-base text-center">
                {"Desde muy joven la tinta marcó mi camino. Hoy convierto cada cita en una experiencia íntima y meticulosa donde el detalle, la higiene y el diseño se elevan a un estándar premium. Cada tatuaje es una pieza única — diseñada contigo, ejecutada con precisión, pensada para durar.".split(" ").map((w, i) => (
                  <span key={i} style={{ animationDelay: `${i * 60}ms` }}>{w}&nbsp;</span>
                ))}
              </p>
            )}
          </article>
        </section>

        <MediaGrid />
        <ContactCard />
        <BookingForm ref={formRef} />

        <footer className="text-center pb-10 px-4">
          <p className="text-xs text-neutral-600">
            © 2026 Niño Tattoo. Todos los derechos reservados. | Handcrafted by{" "}
            <a
              href="https://www.linkedin.com/in/jose-luis-pardo-amador-mlopdev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-gold transition-colors duration-300"
            >
              José Luis Pardo Amador
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
