import { forwardRef, useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const STYLES = ["Realismo", "Blackwork", "Fineline", "Tradicional", "Neotradicional", "Japonés", "Geométrico", "Lettering", "Minimalista"];
const WHATSAPP_NUMBER = "34614287407";

export const BookingForm = forwardRef<HTMLDivElement>(function BookingForm(_, ref) {
  const [desc, setDesc] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [size, setSize] = useState("");
  const [styles, setStyles] = useState<string[]>([]);

  const valid = useMemo(
    () => desc.trim().length >= 4 && phone.trim().length >= 6 && !!date,
    [desc, phone, date]
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const lines = [
      "*Nueva reserva — Niño Tattoo*",
      `*Descripción:* ${desc}`,
      `*Teléfono:* ${phone}`,
      `*Fecha preferida:* ${date ? format(date, "dd/MM/yyyy", { locale: es }) : "-"}`,
    ];
    if (size) lines.push(`*Tamaño:* ${size} cm`);
    if (styles.length) lines.push(`*Estilo:* ${styles.join(", ")}`);
    const text = encodeURIComponent(lines.join("\n"));
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
      : `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section ref={ref} id="reservar" className="px-4 sm:px-8 mt-16 mb-20">
      <div className="relative border border-gold/40 bg-onyx overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(244,241,234,0.06) 1px, transparent 1px), linear-gradient(-45deg, rgba(212,177,90,0.12) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto h-px w-12 gold-line mb-4" />
            <h2 className="font-display text-2xl sm:text-3xl tracking-[0.18em] text-ivory">RESERVAR CITA</h2>
            <p className="text-xs tracking-[0.25em] text-ivory/50 mt-2">PROCESO DIRECTO POR WHATSAPP</p>
          </div>

          <form onSubmit={submit} className="space-y-6 max-w-lg mx-auto">
            <Field label="Descripción del tatuaje *">
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value.slice(0, 600))}
                rows={4}
                placeholder="Idea, zona del cuerpo, referencias..."
                className="w-full bg-transparent border border-gold/30 focus:border-gold outline-none p-3 text-ivory placeholder:text-ivory/30 resize-none"
              />
            </Field>

            <Field label="WhatsApp *">
              <input
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.slice(0, 20))}
                placeholder="+34 600 00 00 00"
                className="w-full bg-transparent border border-gold/30 focus:border-gold outline-none p-3 text-ivory placeholder:text-ivory/30"
              />
            </Field>

            <Field label="Fecha preferida *">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between gap-3 border border-gold/30 hover:border-gold p-3 text-left",
                      !date && "text-ivory/40"
                    )}
                  >
                    <span>{date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}</span>
                    <CalendarIcon className="h-4 w-4 text-gold" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-onyx border-gold/40" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={es}
                    weekStartsOn={1}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field label="Tamaño aprox. (cm)">
              <input
                inputMode="numeric"
                value={size}
                onChange={(e) => setSize(e.target.value.replace(/[^\d.]/g, "").slice(0, 5))}
                placeholder="Opcional"
                className="w-full bg-transparent border border-gold/30 focus:border-gold outline-none p-3 text-ivory placeholder:text-ivory/30"
              />
            </Field>

            <Field label="Estilo">
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => {
                  const on = styles.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyles((p) => on ? p.filter((x) => x !== s) : [...p, s])}
                      className={cn(
                        "px-3 py-1.5 text-xs tracking-[0.15em] uppercase border transition-colors",
                        on
                          ? "bg-gold text-onyx border-gold"
                          : "border-gold/40 text-ivory/80 hover:border-gold"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </Field>

            <button
              type="submit"
              disabled={!valid}
              className={cn(
                "w-full mt-4 py-4 tracking-[0.22em] uppercase text-sm border transition-all",
                valid
                  ? "bg-gold text-onyx border-gold hover:brightness-110 active:scale-[0.99]"
                  : "border-ivory/15 text-ivory/30 cursor-not-allowed"
              )}
            >
              {valid ? "Enviar reserva por WhatsApp" : "Completa los campos requeridos"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.28em] text-gold/80 uppercase mb-2">{label}</span>
      {children}
    </label>
  );
}
