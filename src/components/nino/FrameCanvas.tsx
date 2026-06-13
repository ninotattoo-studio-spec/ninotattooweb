import { useEffect, useRef, useState } from "react";

interface Props {
  prefix: string;
  pad: number;
  start: number;
  end: number;
  ext: string;
  progress: number;
  className?: string;
  freezeAtEnd?: boolean;
  fit?: "cover" | "contain";
}

export function FrameCanvas({
  prefix, pad, start, end, ext, progress,
  className, freezeAtEnd, fit = "cover",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [, force] = useState(0);

  const total = end - start + 1;

  // Preload en batches paralelos en lugar de setTimeout encadenado
  useEffect(() => {
    imagesRef.current = new Array(total).fill(null);
    let cancelled = false;

    const loadOne = (i: number): Promise<void> => {
      return new Promise((resolve) => {
        if (cancelled || i >= total) return resolve();
        const num = String(start + i).padStart(pad, "0");
        const img = new Image();
        img.src = `${prefix}${num}${ext}`;
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) {
            imagesRef.current[i] = img;
            // Re-render cada 10 frames cargados
            if (i % 10 === 0) force((n) => n + 1);
          }
          resolve();
        };
        img.onerror = () => {
          imagesRef.current[i] = img; // marca como intentado
          resolve();
        };
      });
    };

    const loadBatch = async (startIdx: number, batchSize: number) => {
      if (cancelled) return;
      const promises: Promise<void>[] = [];
      for (let i = startIdx; i < Math.min(startIdx + batchSize, total); i++) {
        promises.push(loadOne(i));
      }
      await Promise.all(promises);
      if (!cancelled) force((n) => n + 1);
    };

    // Carga prioritaria: primero el frame 0 solo, luego todo en batches de 10
    loadOne(0).then(() => {
      force((n) => n + 1);
      const loadAll = async () => {
        for (let i = 1; i < total; i += 10) {
          if (cancelled) break;
          await loadBatch(i, 10);
        }
      };
      loadAll();
    });

    return () => { cancelled = true; };
  }, [prefix, pad, start, end, ext, total]);

  // Efecto de dibujo — depende explícitamente de progress y force
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let p = progress;
    if (freezeAtEnd && p > 1) p = 1;
    p = Math.max(0, Math.min(1, p));

    // Umbral de seguridad: si progress >= 0.95, forzar último frame
    const targetIdx = p >= 0.95
      ? total - 1
      : Math.min(total - 1, Math.floor(p * (total - 1)));

    // *** BUG CRÍTICO CORREGIDO: img nunca estaba declarada ***
    let img: HTMLImageElement | null = imagesRef.current[targetIdx];

    // Búsqueda bidireccional: primero hacia atrás (frames ya cargados),
    // luego hacia adelante si no hay nada atrás
    if (!img || !img.complete || img.naturalWidth === 0) {
      // 1. Buscar hacia atrás (frames que SÍ han cargado)
      for (let i = targetIdx - 1; i >= 0; i--) {
        const candidate = imagesRef.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          img = candidate;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) {
      // 2. Si tampoco hay nada atrás, buscar hacia adelante
      for (let i = targetIdx + 1; i < total; i++) {
        const candidate = imagesRef.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          img = candidate;
          break;
        }
      }
    }

    // Si no hay ningún frame disponible aún, no pintar
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (w === 0 || h === 0) return;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw = w, dh = h, dx = 0, dy = 0;
    const useCover = fit === "cover";
    if ((useCover && ir > cr) || (!useCover && ir < cr)) {
      dh = h;
      dw = h * ir;
      dx = (w - dw) / 2;
    } else {
      dw = w;
      dh = w / ir;
      dy = (h - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  }); // sin dependencias = se ejecuta en cada render (correcto aquí)

  return <canvas ref={canvasRef} className={className} />;
}