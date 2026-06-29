import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { ArthakLoader } from "./ArthakLoader";

const STEPS = [
  "Preparing your career workspace…",
  "Syncing resume…",
  "Loading roadmap…",
  "Loading AI recommendations…",
  "Fetching progress…",
  "Opening dashboard…",
];

export function LoadingWorkspace() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => Math.min(i + 1, STEPS.length - 1));
    }, 420);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative p-8">
      <div className="flex flex-col items-center text-center">
        {/* Custom Premium Logo Loader */}
        <div className="h-14 w-full flex items-center justify-center mb-4">
          <ArthakLoader size={38} speed={1.0} />
        </div>
        <h3 className="mt-2 text-base font-bold tracking-tight" style={{ color: "#0F172A" }}>
          Setting up your Career OS
        </h3>
        <p className="mt-1.5 text-xs text-gray-500 max-w-[280px]">
          Just a moment — assembling the pieces of your journey.
        </p>
      </div>
      <ul className="mt-6 space-y-2">
        {STEPS.map((label, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <motion.li
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold"
              style={{
                background: current ? "rgba(20,184,166,0.06)" : "transparent",
                color: done || current ? "#0F172A" : "#94A3B8",
              }}
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#14B8A6" }} />
              ) : current ? (
                <span className="h-4 w-4 shrink-0 flex items-center justify-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </span>
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border" style={{ borderColor: "rgba(15,23,42,0.15)" }} />
              )}
              {label}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
