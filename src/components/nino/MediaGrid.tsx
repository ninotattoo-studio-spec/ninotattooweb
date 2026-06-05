import { useState } from "react";
import { Lightbox, type LightboxItem } from "./Lightbox";

const tattooImages: LightboxItem[] = Array.from({ length: 5 }, (_, i) => ({
  type: "image" as const,
  src: `/frames/trabajos/trabajo${i + 1}.png`,
  alt: `Trabajo ${i + 1}`,
}));

const placeholderImg = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='%231a1a1a'/><text x='50%' y='50%' fill='%23707070' font-family='serif' font-size='22' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`
  )}`;

const sections: { title: string; items: LightboxItem[] }[] = [
  { title: "Tatuajes", items: tattooImages },
  { title: "Depilación Láser", items: [{ type: "image", src: placeholderImg("Depilación Láser"), alt: "Depilación láser" }] },
  { title: "Cuidados", items: [{ type: "image", src: placeholderImg("Cuidados"), alt: "Cuidados" }] },
  { title: "Piercings", items: [{ type: "image", src: placeholderImg("Piercings"), alt: "Piercings" }] },
];

export function MediaGrid() {
  const [lb, setLb] = useState<{ items: LightboxItem[]; index: number } | null>(null);

  return (
    <section className="px-4 sm:px-8 mt-16">
      <div className="text-center mb-8">
        <div className="mx-auto h-px w-12 gold-line mb-4" />
        <h2 className="font-display text-2xl sm:text-3xl tracking-[0.18em] text-ivory">SERVICIOS</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sections.map((s) => {
          const cover = s.items[0];
          return (
            <article key={s.title} className="group relative overflow-hidden border border-gold/20 bg-onyx aspect-[4/5]">
              <button
                onClick={() => setLb({ items: s.items, index: 0 })}
                className="absolute inset-0 w-full h-full"
                aria-label={`Ver ${s.title}`}
              >
                {cover.type === "image" ? (
                  <img src={cover.src} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105" loading="lazy" />
                ) : (
                  <video src={cover.src} muted playsInline loop className="w-full h-full object-cover" />
                )}
                {/* smoke overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0 group-active:opacity-0"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 50% 50%, rgba(26,26,26,0.35), rgba(26,26,26,0.85) 90%)",
                  }}
                />
                {/* gold frame on hover */}
                <div className="absolute inset-2 border border-gold/0 group-hover:border-gold/70 group-active:border-gold/70 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <h3 className="font-display text-ivory tracking-[0.18em] text-lg">{s.title.toUpperCase()}</h3>
                  <span className="mt-1 inline-block text-[10px] tracking-[0.3em] text-gold/80">VER MÁS</span>
                </div>
              </button>

              {/* secondary thumbnails for tattoos */}
              {s.items.length > 1 && (
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {s.items.slice(0, 4).map((it, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setLb({ items: s.items, index: i }); }}
                      className="w-9 h-9 border border-gold/40 overflow-hidden hover:border-gold"
                      aria-label={`Abrir ${i + 1}`}
                    >
                      <img src={it.src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <Lightbox
        items={lb?.items ?? []}
        index={lb?.index ?? null}
        onClose={() => setLb(null)}
        onChange={(i) => setLb((p) => (p ? { ...p, index: i } : p))}
      />
    </section>
  );
}
