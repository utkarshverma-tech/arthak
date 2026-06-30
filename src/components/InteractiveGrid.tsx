import { useEffect, useRef } from "react";

/**
 * A full-bleed grid of subtle cells. When the cursor moves, the cells within
 * a radius lift up and glow with an orange-to-amber band oklch color — so it
 * looks like a living surface reacting to the viewer.
 */
export function InteractiveGrid({
  cell = 56,
  radius = 170,
}: {
  cell?: number;
  radius?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cellsRef = useRef<HTMLDivElement[]>([]);
  const sizeRef = useRef({ cols: 0, rows: 0 });
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const activeIdxRef = useRef<Set<number>>(new Set());
  const rafRef = useRef<number | null>(null);

  // build / rebuild the grid on resize
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const build = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cols = Math.ceil(w / cell) + 1;
      const rows = Math.ceil(h / cell) + 1;
      sizeRef.current = { cols, rows };

      wrap.style.gridTemplateColumns = `repeat(${cols}, ${cell}px)`;
      wrap.style.gridTemplateRows = `repeat(${rows}, ${cell}px)`;
      wrap.innerHTML = "";
      const frag = document.createDocumentFragment();
      const next: HTMLDivElement[] = [];
      for (let i = 0; i < cols * rows; i++) {
        const d = document.createElement("div");
        d.className = "arthak-grid-cell";
        frag.appendChild(d);
        next.push(d);
      }
      wrap.appendChild(frag);
      cellsRef.current = next;
      activeIdxRef.current.clear();
    };

    build();
    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cell]);

  // mouse tracking + rAF render
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const tick = () => {
      const { cols } = sizeRef.current;
      const cells = cellsRef.current;
      if (cells.length && cols) {
        const { x: mx, y: my } = mouseRef.current;
        const r2 = radius * radius;
        const minCol = Math.max(0, Math.floor((mx - radius) / cell));
        const maxCol = Math.min(cols - 1, Math.ceil((mx + radius) / cell));
        const rows = sizeRef.current.rows;
        const minRow = Math.max(0, Math.floor((my - radius) / cell));
        const maxRow = Math.min(rows - 1, Math.ceil((my + radius) / cell));

        const nextActive = new Set<number>();
        if (mouseRef.current.active) {
          for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
              const cx = c * cell + cell / 2;
              const cy = r * cell + cell / 2;
              const dx = cx - mx;
              const dy = cy - my;
              const d2 = dx * dx + dy * dy;
              if (d2 > r2) continue;
              const idx = r * cols + c;
              const cellEl = cells[idx];
              if (!cellEl) continue;
              const t = 1 - Math.sqrt(d2) / radius; // 0..1
              const hue = ((c * 4 + r * 7) % 20) + 32; // premium orange-amber band (oklch 32-52)
              const lift = (t * 14).toFixed(1);
              const alpha = (t * 0.45).toFixed(3);
              const glow = (t * 0.35).toFixed(3);
              cellEl.style.transform = `translate3d(0, -${lift}px, 0)`;
              cellEl.style.background = `oklch(0.66 0.22 ${hue} / ${alpha})`;
              cellEl.style.boxShadow = `0 ${(t * 18).toFixed(1)}px ${(t * 36).toFixed(1)}px -8px oklch(0.66 0.22 ${hue} / ${glow})`;
              cellEl.style.borderColor = `oklch(0.78 0.16 ${hue} / ${(t * 0.55).toFixed(3)})`;
              nextActive.add(idx);
            }
          }
        }

        // reset cells that left the radius
        for (const idx of activeIdxRef.current) {
          if (!nextActive.has(idx)) {
            const el = cells[idx];
            if (el) {
              el.style.transform = "";
              el.style.background = "";
              el.style.boxShadow = "";
              el.style.borderColor = "";
            }
          }
        }
        activeIdxRef.current = nextActive;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cell, radius]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 grid"
      style={{ perspective: "800px" }}
    />
  );
}
