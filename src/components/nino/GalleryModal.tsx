import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Lightbox, type LightboxItem } from "./Lightbox";

interface Props {
  open: boolean;
  title: string;
  items: LightboxItem[];
  onClose: () => void;
}

export function GalleryModal({ open, title, items, onClose }: Props) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lbIndex !== null) setLbIndex(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, lbIndex]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9000] bg-onyx flex flex-col">
      {/* Top bar: always visible, X always reachable */}
      <div className="relative flex items-center gap-3 px-4 py-4 border-b border-gold/30 bg-onyx z-[9010]">
        <button
          onClick={onClose}
          aria-label="Cerrar galería"
          type="button"
          className="p-2.5 border border-gold/50 text-ivory hover:text-gold hover:border-gold transition-colors active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="font-display text-ivory tracking-[0.2em] text-sm sm:text-base uppercase">
          {title}
        </h2>
      </div>

      {/* Own scroll area */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-5 py-4">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-ivory/50 text-xs tracking-[0.3em] uppercase">
            Próximamente
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {items.map((it, i) => (
              <button
                key={i}
                onClick={() => setLbIndex(i)}
                className="group relative aspect-square overflow-hidden border border-gold/20 bg-onyx/60 active:scale-[0.98] transition-transform"
                aria-label={`Abrir ${it.alt ?? `imagen ${i + 1}`}`}
              >
                <img
                  src={it.src}
                  alt={it.alt ?? `Imagen ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        items={items}
        index={lbIndex}
        onClose={() => setLbIndex(null)}
        onChange={(i) => setLbIndex(i)}
      />
    </div>,
    document.body,
  );
}

