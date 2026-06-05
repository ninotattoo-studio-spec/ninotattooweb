import { useState } from "react";
import { Phone, Mail, Instagram, Music2, Check } from "lucide-react";

const PHONE = "614 28 74 07";
const EMAIL = "joseycarbonero@gmail.com";

export function ContactCard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <section className="px-4 sm:px-8 mt-16">
      <div className="relative border border-gold/30 bg-onyx overflow-hidden">
        <div className="absolute inset-0 geo-lines opacity-40 pointer-events-none" />
        <div className="relative p-8 sm:p-10">
          <div className="text-center">
            <div className="mx-auto h-px w-12 gold-line mb-4" />
            <h2 className="font-display text-2xl tracking-[0.18em] text-ivory">CONTACTO</h2>
          </div>

          <div className="mt-8 space-y-4 max-w-md mx-auto">
            <button
              onClick={() => copy(PHONE.replace(/\s/g, ""), "phone")}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 border border-gold/30 hover:border-gold transition-colors group"
            >
              <span className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold" strokeWidth={1.5} />
                <span className="font-sans tracking-[0.18em] text-ivory">{PHONE}</span>
              </span>
              <span className="text-[10px] tracking-[0.25em] text-gold/70 group-hover:text-gold">
                {copied === "phone" ? <span className="flex items-center gap-1"><Check className="h-3 w-3" />COPIADO</span> : "COPIAR"}
              </span>
            </button>

            <button
              onClick={() => copy(EMAIL, "email")}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 border border-gold/30 hover:border-gold transition-colors group"
            >
              <span className="flex items-center gap-3 min-w-0">
                <Mail className="h-4 w-4 text-gold shrink-0" strokeWidth={1.5} />
                <span className="font-sans tracking-wide text-ivory text-sm sm:text-base truncate">{EMAIL}</span>
              </span>
              <span className="text-[10px] tracking-[0.25em] text-gold/70 group-hover:text-gold shrink-0">
                {copied === "email" ? <span className="flex items-center gap-1"><Check className="h-3 w-3" />COPIADO</span> : "COPIAR"}
              </span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-5">
            <a
              href="#"
              aria-label="Instagram"
              className="p-3 border border-gold/40 text-gold hover:bg-gold hover:text-onyx transition-colors"
            >
              <Instagram className="h-5 w-5" strokeWidth={1.5} />
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="p-3 border border-gold/40 text-gold hover:bg-gold hover:text-onyx transition-colors"
            >
              <Music2 className="h-5 w-5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* floating confirmation */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] glass-dark border border-gold px-5 py-2.5 text-gold text-xs tracking-[0.2em] transition-all duration-300 ${
          copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        ✓ COPIADO CON ÉXITO
      </div>
    </section>
  );
}
