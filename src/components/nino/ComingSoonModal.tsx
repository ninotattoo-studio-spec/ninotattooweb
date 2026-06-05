import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  kind: "merch" | "sorteos";
  onClose: () => void;
}

export function ComingSoonModal({ open, kind, onClose }: Props) {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);

  if (!open && !sent) {
    // reset when closed
  }

  const title = kind === "merch" ? "Colección Exclusiva" : "Sorteos Premium";

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-onyx/80 backdrop-blur-md" onClick={onClose} />
      <div
        className={`relative w-full max-w-md bg-onyx border border-gold/50 p-8 sm:p-10 transition-transform duration-500 ${
          open ? "translate-y-0 scale-100" : "translate-y-6 scale-95"
        }`}
        style={{
          boxShadow: "0 0 0 1px rgba(212,177,90,0.15), 0 30px 80px -20px rgba(0,0,0,0.8)",
        }}
      >
        {/* beveled gold corners */}
        <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold" />
        <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold" />
        <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold" />
        <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold" />

        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 text-ivory/50 hover:text-gold"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="font-display text-center text-2xl tracking-[0.12em] gold-gradient-text">
          {title}
        </h3>
        <p className="mt-3 text-center text-ivory/70 text-sm font-sans tracking-wide">
          Abriremos Próximamente
        </p>

        <div className="mt-8 mx-auto h-px w-16 gold-line" />

        {sent ? (
          <p className="mt-8 text-center text-gold tracking-widest text-sm">
            ✓ EN LISTA PRIORITARIA
          </p>
        ) : (
          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (value.trim().length < 4) return;
              setSent(true);
              setTimeout(() => { setSent(false); setValue(""); onClose(); }, 1800);
            }}
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={120}
              placeholder="Teléfono o email"
              className="w-full bg-transparent border-0 border-b border-gold/50 focus:border-gold outline-none py-2 text-ivory placeholder:text-ivory/30 tracking-wide text-center"
            />
            <button
              type="submit"
              className="w-full border border-gold/60 text-gold tracking-[0.18em] uppercase text-xs py-3 hover:bg-gold hover:text-onyx transition-colors"
            >
              Recibir Acceso Prioritario
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
