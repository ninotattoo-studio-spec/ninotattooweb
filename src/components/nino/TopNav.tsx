import { useState } from "react";
import { Menu } from "lucide-react";
import { ComingSoonModal } from "./ComingSoonModal";

interface Props {
  visible: boolean;
  onReserve: () => void;
}

export function TopNav({ visible, onReserve }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modal, setModal] = useState<null | "merch" | "sorteos">(null);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-end gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
          <button
            onClick={onReserve}
            className="glass-dark border border-ivory/40 text-ivory font-sans text-xs sm:text-sm tracking-[0.18em] uppercase px-4 py-2.5 rounded-sm transition-all duration-300 hover:border-gold hover:text-gold active:scale-95"
          >
            Reservar Cita
          </button>
          <button
            aria-label="Abrir menú"
            onClick={() => setDrawerOpen(true)}
            className="glass-dark p-2.5 rounded-sm border border-ivory/20 hover:border-gold transition-colors active:scale-95"
          >
            <Menu className="h-5 w-5 text-gold" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-onyx/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[82%] max-w-sm glass-dark border-l border-gold/40 transition-transform duration-500 ease-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full p-8">
            <button
              onClick={() => setDrawerOpen(false)}
              className="self-end text-ivory/60 hover:text-gold text-sm tracking-widest"
            >
              CERRAR
            </button>
            <div className="mt-12 space-y-8 font-display">
              <button
                onClick={() => { setDrawerOpen(false); setTimeout(() => setModal("merch"), 350); }}
                className="block w-full text-left text-2xl tracking-[0.15em] text-ivory hover:text-gold transition-colors border-b border-gold/20 pb-3"
              >
                MERCHANDISING
              </button>
              <button
                onClick={() => { setDrawerOpen(false); setTimeout(() => setModal("sorteos"), 350); }}
                className="block w-full text-left text-2xl tracking-[0.15em] text-ivory hover:text-gold transition-colors border-b border-gold/20 pb-3"
              >
                SORTEOS
              </button>
            </div>
            <div className="mt-auto text-[10px] tracking-[0.3em] text-ivory/40 uppercase">
              Niño Tattoo
            </div>
          </div>
        </aside>
      </div>

      <ComingSoonModal
        open={modal !== null}
        kind={modal ?? "merch"}
        onClose={() => setModal(null)}
      />
    </>
  );
}
