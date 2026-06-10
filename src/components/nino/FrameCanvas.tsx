import { useEffect, useRef, useState } from "react";

interface Props {
  /** Path prefix, e.g. "/frames/chica/hero-girlrt_" */
  prefix: string;
  /** Padded count, e.g. 4 */
  pad: number;
  start: number;
  end: number;
  /** ".jpg" */
  ext: string;
  /** 0..1 */
  progress: number;
  className?: string;
  /** If true, canvas keeps the last frame even when progress > 1 */
  freezeAtEnd?: boolean;
  /** "cover" (default) crops to fill; "contain" letterboxes, no deformation */
  fit?: "cover" | "contain";
}

export function FrameCanvas({ prefix, pad, start, end, ext, progress, className, freezeAtEnd, fit = "cover" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [, force] = useState(0);

  const total = end - start + 1;

  // Preload progressively
  useEffect(() => {
    imagesRef.current = new Array(total).fill(null);
    let cancelled = false;
    const loadIdx = (i: number) => {
      if (cancelled || i >= total) return;
      const num = String(start + i).padStart(pad, "0");
      const img = new Image();
      img.src = `${prefix}${num}${ext}`;
      img.decoding = "async";
      img.onload = () => {
        imagesRef.current[i] = img;
        if (i % 20 === 0) force((n) => n + 1);
      };
      img.onerror = () => {
        imagesRef.current[i] = img; // mark as attempted
      };
      // staggered for bandwidth
      setTimeout(() => loadIdx(i + 1), 8);
    };
    // load first frame eagerly, then ramp
    loadIdx(0);
    setTimeout(() => loadIdx(1), 0);
    return () => { cancelled = true; };
  }, [prefix, pad, start, end, ext, total]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let p = progress;
    if (freezeAtEnd && p > 1) p = 1;
    p = Math.max(0, Math.min(1, p));
    const idx = Math.min(total - 1, Math.floor(p * (total - 1)));

    // Find nearest loaded image at or before idx
    let img: HTMLImageElement | null = null;
    for (let i = idx; i >= 0; i--) {
      const candidate = imagesRef.current[i];
      if (candidate && candidate.complete && candidate.naturalWidth > 0) {
        img = candidate;
        break;
      }
    }
    if (!img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // cover fit
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw = w, dh = h, dx = 0, dy = 0;
    if (ir > cr) {
      dh = h;
      dw = h * ir;
      dx = (w - dw) / 2;
    } else {
      dw = w;
      dh = w / ir;
      dy = (h - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  });

  return <canvas ref={canvasRef} className={className} />;
}
