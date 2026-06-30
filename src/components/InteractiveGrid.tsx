import { useEffect, useState } from "react";

export function InteractiveGrid() {
  const [columns, setColumns] = useState(24);
  const [rows, setRows] = useState(14);

  useEffect(() => {
    const calculateGrid = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Grid cell size of 64px
      setColumns(Math.ceil(width / 64));
      setRows(Math.ceil(height / 64));
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  const totalCells = columns * rows;

  return (
    <div
      className="absolute inset-0 grid w-full h-full overflow-hidden pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: totalCells }).map((_, i) => (
        <div
          key={i}
          className="relative border-[0.5px] border-slate-900/[0.04] w-full h-full pointer-events-auto transition-all duration-700 ease-out hover:z-10 hover:duration-75 hover:bg-white hover:border-teal-500/35 hover:rounded-lg hover:scale-108 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_-8px_rgba(20,184,166,0.25)]"
          style={{
            boxSizing: "border-box",
          }}
        />
      ))}
    </div>
  );
}
