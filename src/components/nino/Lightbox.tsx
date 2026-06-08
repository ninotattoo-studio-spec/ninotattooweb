import { useEffect } from "react";
import { X } from "lucide-react";

type Item = { type: "image" | "video"; src: string; alt?: string };

interface Props {
  items: Item[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}

export function Lightbox({ items, index, onClose, onChange }: Props) {
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index !== null) onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft" && index !== null) onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onChange, onClose]);

  if (!open || index === null) return null;
  const it = items[index];

  return (
    <div
      className="fixed inset-0 z-[100] bg-onyx/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Cerrar"
        type="button"
        className="absolute top-4 right-4 z-[110] text-ivory hover:text-gold p-3 border border-gold/40 bg-onyx/80"
      >
        <X className="h-6 w-6" />
      </button>
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {it.type === "image" ? (
          <img src={it.src} alt={it.alt ?? ""} className="max-w-full max-h-full object-contain border border-gold/30" />
        ) : (
          <video src={it.src} controls autoPlay playsInline className="max-w-full max-h-full border border-gold/30" />
        )}
      </div>
    </div>
  );
}

export type { Item as LightboxItem };
