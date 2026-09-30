import { useState } from "react";
import { GalleryModal } from "./GalleryModal";
import type { LightboxItem } from "./Lightbox";

// Función auxiliar para cargar archivos multimedia automáticamente
function parseMedia(
  modules: Record<string, { default: string }>,
  categoryName: string
): LightboxItem[] {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b, "es", { numeric: true }))
    .map(([path, mod], i) => {
      const ext = path.split(".").pop()?.toLowerCase() || "";
      const isVideo = ["mp4", "webm", "mov"].includes(ext);
      return {
        type: isVideo ? ("video" as const) : ("image" as const),
        src: mod.default,
        alt: `${categoryName} ${i + 1}`,
      };
    });
}

// Carga de módulos por cada sección
const tattooImages = parseMedia(
  import.meta.glob("/src/assets/trabajos/*.{png,jpg,jpeg,webp,mp4,webm}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
  "Trabajo"
);

const laserItems = parseMedia(
  import.meta.glob("/src/assets/laser/*.{png,jpg,jpeg,webp,mp4,webm}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
  "Láser"
);

const cuidadosItems = parseMedia(
  import.meta.glob("/src/assets/cuidados/*.{png,jpg,jpeg,webp,mp4,webm}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
  "Cuidados"
);

const piercingsItems = parseMedia(
  import.meta.glob("/src/assets/piercings/*.{png,jpg,jpeg,webp,mp4,webm}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
  "Piercing"
);

type Section = { title: string; items: LightboxItem[]; comingSoon?: boolean };

// Conectamos cada lista a su carta correspondiente
const sections: Section[] = [
  { title: "Tatuajes", items: tattooImages },
  { title: "Eliminación Láser", items: laserItems },
  { title: "Cuidados", items: cuidadosItems },
  { title: "Piercings", items: piercingsItems },
];

export function MediaGrid() {
  const [active, setActive] = useState<Section | null>(null);

  return (
    <section className="px-4 sm:px-8 mt-16">
      <div className="text-center mb-8">
        <div className="mx-auto h-px w-12 gold-line mb-4" />
        <h2 className="font-display text-2xl sm:text-3xl tracking-[0.18em] text-ivory">SERVICIOS</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sections.map((s) => {
          const cover = s.items[0];
          const disabled = s.comingSoon || s.items.length === 0;
          return (
            <article key={s.title} className="group relative overflow-hidden border border-gold/20 bg-onyx aspect-[4/5]">
              <button
                onClick={() => !disabled && setActive(s)}
                className="absolute inset-0 w-full h-full"
                aria-label={`Ver ${s.title}`}
                disabled={disabled}
              >
                {cover ? (
                  cover.type === "video" ? (
                    <video
                      src={cover.src}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
                      muted
                      autoPlay
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={cover.src}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
                      loading="lazy"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center geo-lines opacity-60" />
                )}
                <div
                  className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0 group-active:opacity-0"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 50% 50%, rgba(26,26,26,0.35), rgba(26,26,26,0.85) 90%)",
                  }}
                />
                <div className="absolute inset-2 border border-gold/0 group-hover:border-gold/70 group-active:border-gold/70 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <h3 className="font-display text-ivory tracking-[0.18em] text-lg">{s.title.toUpperCase()}</h3>
                  <span className="mt-1 inline-block text-[10px] tracking-[0.3em] text-gold/80">
                    {disabled ? "PRÓXIMAMENTE" : "VER MÁS"}
                  </span>
                </div>
              </button>
            </article>
          );
        })}
      </div>

      <GalleryModal
        open={active !== null}
        title={active?.title ?? ""}
        items={active?.items ?? []}
        onClose={() => setActive(null)}
      />
    </section>
  );
}